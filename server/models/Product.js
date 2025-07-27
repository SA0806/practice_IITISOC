import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  model: String,
  price: Number
});


export default productSchema;
