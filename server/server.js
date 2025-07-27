import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";

import stripeRoute from './routes/stripe.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ✅ Connect to checkoutDB (for Stripe etc.)
const checkoutConnection = mongoose.createConnection(process.env.CHECKOUT_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
checkoutConnection.on('connected', () => {
  console.log('✅ Connected to checkoutDB');
});
checkoutConnection.on('error', (err) => {
  console.error('❌ Error connecting to checkoutDB:', err);
});

// ✅ Connect to AR_House_Design DB (for furniture/products)
const arDesignConnection = mongoose.createConnection(process.env.AR_HOUSE_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
arDesignConnection.on('connected', () => {
  console.log('✅ Connected to AR_House_Design DB');
});
arDesignConnection.on('error', (err) => {
  console.error('❌ Error connecting to AR_House_Design DB:', err);
});

// Pass connections to routes if needed
app.use('/api', (req, res, next) => {
  req.checkoutDB = checkoutConnection;
  next();
}, stripeRoute);

app.use('/api/products', (req, res, next) => {
  req.arDesignDB = arDesignConnection;
  next();
}, productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
