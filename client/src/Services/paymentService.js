// client/src/Services/paymentService.js
import axios from "axios";

export const createCheckoutSession = async (items) => {
  const response = await axios.post("/api/checkout", {
    items,
  });
  return response.data;
};
