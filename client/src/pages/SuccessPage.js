import React, { useEffect, useState } from "react";
import "./SuccessPage.css"; // Import the CSS
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
   const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [error, setError] = useState("");

   const handleGoBack = () => {
    navigate('/dashboard'); // Update this route as per your app
  };


  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!sessionId) {
      setIsPaid(false);
      setError("Missing session ID in URL.");
      return;
    }

    fetch(`http://localhost:5000/api/stripe/verify-payment/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.paid) {
          setIsPaid(true);
          setSessionDetails(data.session);
        } else {
          setIsPaid(false);
          setError("Payment not completed or session invalid.");
        }
      })
      .catch((err) => {
        console.error("❌ Error verifying payment:", err);
        setIsPaid(false);
        setError("An unexpected error occurred while verifying your payment.");
      });
  }, []);

  return (
    <div className="success-container">
      {isPaid === null && (
        <h2 className="loading">
          <i
            className="fas fa-spinner fa-spin"
            style={{ marginRight: "8px", color: "#555" }}
          ></i>
          Verifying your payment, please wait...
        </h2>
      )}

      {isPaid === true && (
        <>
          {/* <h2 className="success">✅ Payment Successful!</h2> */}
          <h2 className="success" style={{ color: "green" }}>
            <i
              className="fas fa-check-circle"
              style={{ marginRight: "8px" }}
            ></i>
            Payment Successful!
          </h2>
          <p className="thankyou">Thank you for your purchase.</p>
          
          {/* <h4 className="session-heading">Session Details:</h4> */}
          {/* <pre className="session-box">
            {JSON.stringify(sessionDetails, null, 2)}
          </pre> */}

          <button onClick={handleGoBack} className="dashboard-btn">
          <i className= "fas fa-arrow-circle-left back-to-dashboard-arrow" style={{ marginRight: '6px' }}></i>
          Go Back to Dashboard
        </button>
        </>
      )}

      {isPaid === false && (
        <>
          {/* <h2 className="error">❌ Payment Failed</h2> */}
          <h2 className="error" style={{ color: "red" }}>
            <i
              className="fas fa-times-circle"
              style={{ marginRight: "8px" }}
            ></i>
            Payment Failed
          </h2>
          <p className="error-msg">
            {error || "Something went wrong. Please try again."}
          </p>
        </>
      )}

        
    </div>
  );
};

export default SuccessPage;
