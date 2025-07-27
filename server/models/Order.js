// models/Order.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  total: Number,
});

const orderSchema = new mongoose.Schema({
  sessionId: String,
  customerEmail: String,
  items: [itemSchema],
  amountTotal: Number,
  paymentStatus: String,
});

// ✅ Export a function to register model on passed-in connection
export default function getOrderModel(connection) {
  return connection.models.Order || connection.model("Order", orderSchema);
}
