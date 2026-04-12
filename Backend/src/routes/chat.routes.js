import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getChat, sendMessageUnified, getMessage, getChatId, getChatDelete } from '../controllers/chat.controller.js';
import { upload } from '../utils/upload.js';

const router=express.Router();

/**
 * @route POST /api/chat/
 * @desc Stream AI response for a user message + optional file upload (Server-Sent Events)
 * @access Private
 */
router.post("/", authenticateToken, upload.single("file"), sendMessageUnified);
/**
 * @route GET /api/chats/get-chat/:chatId
 * @desc Get a specific chat by ID
 * @access Private
 */
router.get("/get-chat/:chatId",authenticateToken,getChat);
/**
 * @route GET /api/chats/get-messages/:chatId
 * @desc Get messages for a specific chat
 * @access Private
 */
router.get("/get-messages/:chatId",authenticateToken,getMessage);
/**
 * @route GET /api/chats/get-chat-id
 * @desc Get chat ID for a user
 * @access Private
 */
router.get("/get-chat-id",authenticateToken,getChatId);
/** 
 * @route GET /api/chats/delete-chat/:chatId
 * @desc Delete a specific chat by ID
 * @access Private
 */
router.get("/delete-chat/:chatId",authenticateToken,getChatDelete);

export default router;