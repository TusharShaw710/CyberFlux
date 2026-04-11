import express from "express";
import {googleAuth,googleCallback} from "../controllers/email_auth.controller.js"
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router();
/**
 * @route GET api/email/auth/google
 * @desc Initiate Google OAuth2 authentication
 * @access Private (requires authentication)
 */
router.get("/google",authenticateToken, googleAuth);
/**
 * @route GET api/email/auth/google/callback
 * @desc Handle Google OAuth2 callback
 * @access Private (requires authentication)
 */
router.get("/google/callback", authenticateToken, googleCallback);

export default router;