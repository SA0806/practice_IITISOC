// server/routes/checkout.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  const { items } = req.body;

  const line_items = items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

export default router;
