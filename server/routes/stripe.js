// routes/stripe.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import getOrderModel from "../models/Order.js";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Debugging
console.log("🔑 Stripe Secret Key Loaded");

// 👉 Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body;
  console.log("🛒 Received cartItems:", cartItems);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // price in paise
        },
        quantity: item.quantity || 1, // fallback to 1 if undefined
      })),
      // metadata: {
      //   items: JSON.stringify(cartItems), // pass to webhook later if needed
      // }
      metadata: {
  items: cartItems.map(item => `${item.name} x${item.quantity}`).join(', ')
},
      success_url: `${process.env.REACT_APP}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REACT_APP}/cancel`,
    });

    console.log("✅ Checkout session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 👉 Verify Payment and Save Order
// router.get("/verify-payment/:sessionId", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
//       expand: ["line_items", "customer_details"],
//     });

//     const isPaid = session.payment_status === "paid";
//     const sessionId = session.id;

//     // Prevent duplicates
//     const existingOrder = await getOrderModel.findOne({ sessionId });

//     if (!existingOrder && isPaid) {
//       await getOrderModel.create({
//         sessionId,
//         customerEmail: session.customer_details?.email || "unknown",
//         items: session.line_items.data.map((item) => ({
//           name: item.description,
//           quantity: item.quantity,
//           amount: item.amount_total,
//         })),
//         amountTotal: session.amount_total,
//         paymentStatus: session.payment_status,
//       });

//       console.log("✅ Order saved to DB");
//     } else if (existingOrder) {
//       console.log("ℹ️ Order already exists in DB");
//     }

//     res.json({ paid: isPaid, session });
//   } catch (err) {
//     console.error("❌ Payment Verification Error:", err.message);
//     res.status(400).json({ error: "Invalid session ID" });
//   }
// });

router.get("/verify-payment/:sessionId", async (req, res) => {
  try {
    const Order = getOrderModel(req.checkoutDB); // ✅ Use correct connection

    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ["line_items", "customer_details"],
    });

    const isPaid = session.payment_status === "paid";
    const sessionId = session.id;

    const existingOrder = await Order.findOne({ sessionId });

    if (!existingOrder && isPaid) {
      await Order.create({
        sessionId,
        customerEmail: session.customer_details?.email || "unknown",
        items: session.line_items.data.map((item) => ({
          name: item.description,
          quantity: item.quantity,
          price: item.price.unit_amount / 100,
          total: item.amount_total / 100,
        })),
        amountTotal: session.amount_total / 100,
        paymentStatus: session.payment_status,
      });

      console.log("✅ Order saved to DB");
    } else if (existingOrder) {
      console.log("ℹ️ Order already exists in DB");
    }

    res.json({ paid: isPaid, session });
  } catch (err) {
    console.error("❌ Payment Verification Error:", err.message);
    res.status(400).json({ error: "Invalid session ID" });
  }
});


export default router;
