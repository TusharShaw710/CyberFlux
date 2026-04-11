import express from "express";
import {sendEmailByUser} from "../controllers/sendEmail.controller.js";
import {authenticateToken} from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/send-by-user", authenticateToken, sendEmailByUser);


export default router;