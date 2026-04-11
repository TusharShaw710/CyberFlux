import express from "express";
import {googleAuth,googleCallback} from "../controllers/email_auth.controller.js"
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/google",authenticateToken, googleAuth);
router.get("/google/callback", authenticateToken, googleCallback);

export default router;