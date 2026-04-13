import express from 'express';
import { validateRegister,validateLogin } from '../validations/auth.validator.js';
import { register,verifyEmail,login,getUser,logout } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register',validateRegister,register);
/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login',validateLogin,login);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 */
router.get('/verify-email',verifyEmail);
/** 
 * @route GET /api/auth/get-user
 * @desc Get authenticated user's details
 * @access Private
 */

router.get('/get-user', authenticateToken, getUser);
router.post('/logout', authenticateToken, logout);

export default router;
