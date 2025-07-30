import React, { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { useLocation } from "react-router-dom";
import './CheckoutPage.css';


const CheckoutPage = () => {
  const { cart } = useContext(CartContext);
  
  const location = useLocation();
  const buyNowItem = location.state?.item;

  // const itemsToCheckout = buyNowItem ? [buyNowItem] : cartItems;
  const itemsToCheckout = buyNowItem ? [buyNowItem] : cart;

  const handleCheckout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: itemsToCheckout }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong during checkout");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
    }
  };

  // return (
  //   <div>
  //     <h2>Checkout</h2>
  //     {itemsToCheckout.length === 0 ? (
  //       <p>No items to checkout</p>
  //     ) : (
  //       <>
  //         <ul>
  //           {itemsToCheckout.map((item, index) => (
  //             <li key={index}>
  //               {item.name} - ₹{item.price} x {item.quantity}
  //             </li>
  //           ))}
  //         </ul>
  //         <button onClick={handleCheckout}>Proceed to Payment</button>
  //       </>
  //     )}
  //   </div>
  // );

  return (
  <div className="checkout-container">
    <h2>Let's Checkout</h2>
    {itemsToCheckout.length === 0 ? (
      <p className="empty-message">No items to checkout</p>
    ) : (
      <>
        {/* <ul className="checkout-items">
          {itemsToCheckout.map((item, index) => (
            <li key={index}>
              <span>{item.name}</span>
              <span>
                ₹{item.price} × {item.quantity}
              </span>
            </li>
          ))}
        </ul> */}

        <ul className="checkout-items">
  {itemsToCheckout.map((item, index) => (
    <li key={index} className="checkout-item">
      <img src={item.image} alt={item.name} className="checkout-image" />
      <div className="checkout-item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">
          ₹{item.price} × {item.quantity}
        </span>
      </div>
    </li>
  ))}
</ul>



        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Payment
        </button>
      </>
    )}
  </div>
);



};

export default CheckoutPage;
