import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import stripeRoute from './routes/stripe.js';
import productRoutes from './routes/productRoutes.js';
import AuthRouter from './routes/AuthRouter.js';
import ProductRouter from './routes/ProductRouter.js';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
// import CartRouter from './routes/CartRouter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors({ origin: process.env.REACT_APP, credentials: true }));
app.use(bodyParser.json());
app.use(express.json());


// Health check
app.get('/ping', (req, res) => {
  res.send('PONG');
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 5 attempts per IP
  message: { error: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// DB Connections
const checkoutConnection = mongoose.createConnection(process.env.CHECKOUT_DB_URI);
checkoutConnection.on('connected', () => {
  console.log('Connected to checkoutDB');
});
checkoutConnection.on('error', (err) => {
  console.error('Error connecting to checkoutDB:', err);
});

const arDesignConnection = mongoose.createConnection(process.env.AR_HOUSE_DB_URI);
arDesignConnection.on('connected', () => {
  console.log('Connected to AR_House_Design DB');
});
arDesignConnection.on('error', (err) => {
  console.error('Error connecting to AR_House_Design DB:', err);
});

mongoose.connect(process.env.MONGO_CONN).then(() => {
  console.log('Connected to shared users/auth DB');
}).catch(err => {
  console.error('Error connecting to shared DB:', err);
});

// Route middleware with DB injection
app.use('/api/stripe', (req, res, next) => {
  req.checkoutDB = checkoutConnection;
  next();
}, stripeRoute);

app.use('/api/products', (req, res, next) => {
  req.arDesignDB = arDesignConnection;
  next();
}, productRoutes);

// Auth and product routes (uses shared DB via mongoose)
// app.use('/auth', AuthRouter);
app.use('/auth', authLimiter, AuthRouter);
app.use('/products', ProductRouter);
app.use('/api/user', userRoutes);
// app.use('/cart', CartRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

