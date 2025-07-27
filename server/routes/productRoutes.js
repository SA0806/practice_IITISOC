import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define schema once (no model yet)
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  model: String,
});

// Reuse model per request
const getProductModel = (connection) => {
  return connection.models.Product || connection.model("Furniture", productSchema, "Furniture");
};

// GET all products
router.get("/", async (req, res) => {
  try {
    const Product = getProductModel(req.arDesignDB);
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET products by category
router.get("/:category", async (req, res) => {
  try {
    const Product = getProductModel(req.arDesignDB);
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

// POST new product (admin use)
router.post("/", async (req, res) => {
  try {
    const Product = getProductModel(req.arDesignDB);
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
