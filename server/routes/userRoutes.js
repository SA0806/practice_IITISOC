import express from 'express';
import UserModel from '../models/User.js';
import ensureAuthenticated from '../middlewares/Auth.js';
import getOrderModel from '../models/Order.js';

const router = express.Router();

// ✅ Get user data (cart, wishlist, savedLayout, arHistory)
router.get('/me', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cart
router.post('/cart', ensureAuthenticated, async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body;
    const user = await UserModel.findById(req.user._id);
    const existing = user.cart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity || 1;
    } else {
      user.cart.push({ productId, name, price, image, quantity: quantity || 1 });
    }
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/cart/:productId', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.cart = user.cart.filter(item => item.productId !== req.params.productId);
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/cart', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Wishlist
router.post('/wishlist', ensureAuthenticated, async (req, res) => {
  try {
    const { productId, name, price, image, category } = req.body;
    const user = await UserModel.findById(req.user._id);
    const exists = user.wishlist.find(item => item.productId === productId);
    if (exists) return res.json(user.wishlist); // already in wishlist
    user.wishlist.push({ productId, name, price, image, category });
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/wishlist/:productId', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    user.wishlist = user.wishlist.filter(item => item.productId !== req.params.productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Saved Layout
router.post('/layout', ensureAuthenticated, async (req, res) => {
  try {
    const { products } = req.body;
    const user = await UserModel.findById(req.user._id);
    user.savedLayout = products;
    await user.save();
    res.json(user.savedLayout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ AR History — save a session snapshot
router.post('/ar-history', ensureAuthenticated, async (req, res) => {
  try {
    const { products } = req.body;
    const user = await UserModel.findById(req.user._id);
    user.arHistory.push({ products, date: new Date() });
    // keep last 10 sessions only
    if (user.arHistory.length > 10) {
      user.arHistory = user.arHistory.slice(-10);
    }
    await user.save();
    res.json(user.arHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET order history by email
router.get('/orders', ensureAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('email');
    const Order = getOrderModel(req.checkoutDB);
    const orders = await Order.find({ customerEmail: user.email }).sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;