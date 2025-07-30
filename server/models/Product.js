import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  model: String,
  price: Number
});

// Register and export the model
const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;
