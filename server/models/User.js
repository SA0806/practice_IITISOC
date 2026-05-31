import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String },
  price: { type: Number },
  image: { type: String },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const wishlistItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String },
  price: { type: Number },
  image: { type: String },
  category: { type: String }
}, { _id: false });

const savedLayoutItemSchema = new Schema({
  productId: { type: String },
  name: { type: String },
  category: { type: String },
  image: { type: String },
  model: { type: String },
  price: { type: Number }
}, { _id: false });

const arSessionSchema = new Schema({
  date: { type: Date, default: Date.now },
  products: [savedLayoutItemSchema]
}, { _id: false });

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
  savedLayout: [savedLayoutItemSchema],
  arHistory: [arSessionSchema]
});

const UserModel = model('users', UserSchema);
export default UserModel;