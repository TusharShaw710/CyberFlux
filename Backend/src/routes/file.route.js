import express from "express";
import { upload } from "../utils/upload.js";
import { handleFileUpload } from "../controllers/file.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload", authenticateToken, upload.single("file"), handleFileUpload);

export default router;