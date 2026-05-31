import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { syncRemoveFromWishlist, syncAddToCart } from "../utils/userApi";
import { useCart } from "../Context/CartContext";
import "./ProfilePage.css";

const API = process.env.REACT_APP_API_URL;

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("wishlist");
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [arHistory, setArHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch(`${API}/api/user/me`, { headers: { authorization: token } }),
          fetch(`${API}/api/user/orders`, {
            headers: { authorization: token },
          }),
        ]);
        const user = await userRes.json();
        const ordersData = await ordersRes.json();
        setWishlist(user.wishlist || []);
        setArHistory(user.arHistory || []);
        setOrders(ordersData || []);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveWishlist = async (productId) => {
    await syncRemoveFromWishlist(productId);
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleAddToCart = async (item) => {
    await addToCart(item);
  };

  if (loading)
    return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>{localStorage.getItem("loggedInUser")}</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Wishlist ({wishlist.length})
        </button>
        <button
          className={`profile-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Order History ({orders.length})
        </button>
        <button
          className={`profile-tab ${activeTab === "ar-history" ? "active" : ""}`}
          onClick={() => setActiveTab("ar-history")}
        >
          AR History ({arHistory.length})
        </button>
      </div>

      <div className="profile-content">
        {/* WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="profile-section">
            {wishlist.length === 0 ? (
              <p className="empty-message">No items in your wishlist yet.</p>
            ) : (
              <div className="profile-grid">
                {wishlist.map((item) => (
                  <div key={item.productId} className="profile-card">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="profile-card-img"
                    />
                    <div className="profile-card-info">
                      <h3>{item.name}</h3>
                      <p className="profile-card-price">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </p>
                      <p className="profile-card-category">{item.category}</p>
                    </div>
                    <div className="profile-card-actions">
                      <button
                        className="profile-btn-cart"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="profile-btn-remove"
                        onClick={() => handleRemoveWishlist(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="profile-section">
            {orders.length === 0 ? (
              <p className="empty-message">No orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order, idx) => (
                  <div key={order.sessionId} className="order-card">
                    <div className="order-header">
                      <div className="order-header-left">
                        <span className="order-number">
                          Order #{orders.length - idx}
                        </span>
                        <span className="order-status">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <span className="order-total">
                        ₹{order.amountTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <table className="order-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td>×{item.quantity}</td>
                            <td>₹{item.total.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AR HISTORY */}
        {activeTab === "ar-history" && (
          <div className="profile-section">
            {arHistory.length === 0 ? (
              <p className="empty-message">No AR sessions yet.</p>
            ) : (
              <div className="ar-history-list">
                {arHistory.map((session, i) => (
                  <div key={i} className="ar-session-card">
                    <div className="ar-session-header">
                      <span>Session {arHistory.length - i}</span>
                      <span className="ar-session-date">
                        {new Date(session.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="ar-session-items">
                      {session.products.map((p, j) => (
                        <div key={j} className="ar-session-item">
                          <img src={p.image} alt={p.name} />
                          <span>{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
