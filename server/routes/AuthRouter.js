import express from 'express';
import { signup, login } from '../controllers/AuthControllers.js';
import { signupValidation, loginValidation } from '../middlewares/AuthValidation.js';

const AuthRouter = express.Router();

// Auth routes
AuthRouter.post('/login', loginValidation, login);
AuthRouter.post('/signup', signupValidation, signup);

export default AuthRouter;

