// ProductRouter.js
import ensureAuthenticated from '../middlewares/Auth.js';
import express from 'express';

const ProductRouter = express.Router();

ProductRouter.get('/', ensureAuthenticated, (req, res) => {
  console.log('---- logged in user detail ---', req.user);
  res.status(200).json([
    { name: 'mobile', price: 10000 },
    { name: 'tv', price: 20000 }
  ]);
});

export default ProductRouter;

