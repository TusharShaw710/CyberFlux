import { getResponse, getResponseStream, getChatTitle } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";
import { processFileWithAI } from "../services/fileAI.service.js";

async function sendMessageUnified(req,res){
    try{
        const { message, chatId } = req.body || {};
        
        if(!message && !req.file){
            return res.status(400).json({
                message:"Message or file is required"
            });
        }

        // Set SSE headers (CORS is already handled by middleware)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let title = null, chat = null;

        // Extract File if exists
        let finalMessage = message || "";
        if (req.file) {
            try {
                const fileSummary = await processFileWithAI(req.file.path, req.file.mimetype);
                finalMessage += finalMessage ? `\n\n[Attached File Content/Analysis]:\n${fileSummary}` : `[Attached File Content/Analysis]:\n${fileSummary}`;
            } catch (err) {
                console.error("Error processing file", err);
            }
        }

        // Create or get chat
        if(!chatId){
            title = await getChatTitle(finalMessage);
            chat = await chatModel.create({
                title: title,
                user: req.user.id
            });
        } else {
            chat = await chatModel.findById(chatId);
        }

        // Save user message
        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            role: "user",
            content: finalMessage
        });

        // Get all messages for context
        const allUserMessages = await messageModel.find({chat: chatId || chat._id});

        // Send chat info as first event
        res.write(`data: ${JSON.stringify({
            type: 'chat_info',
            chatId: chat._id,
            title: title || chat.title
        })}\n\n`);

        let fullResponse = '';
        let tokenCount = 0;
        let tokenSent = false;

        try {
            // Stream the response
            fullResponse = await getResponseStream(allUserMessages, (token) => {
                // Only send the token ONCE to avoid duplication
                if (!tokenSent) {
                    tokenCount++;
                    tokenSent = true;
                    // Send the complete response as a single token event
                    res.write(`data: ${JSON.stringify({
                        type: 'token',
                        content: token
                    })}\n\n`);
                }
            });

            // Save final AI message
            await messageModel.create({
                chat: chatId || chat._id,
                role: "ai",
                content: fullResponse
            });

            // Send completion event
            res.write(`data: ${JSON.stringify({
                type: 'done',
                totalTokens: tokenCount
            })}\n\n`);

            res.end();
        } catch(streamErr){
            console.error('Error in streaming:', streamErr.message);
            res.write(`data: ${JSON.stringify({
                type: 'error',
                message: streamErr.message
            })}\n\n`);
            res.end();
        }
    }catch(err){
        console.error('Error in sendMessageUnified:', err.message);
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({
                message: err.message || "Failed to stream message"
            });
        } else {
            res.write(`data: ${JSON.stringify({
                type: 'error',
                message: err.message || 'Server Error'
            })}\n\n`);
            res.end();
        }
    }
}

async function getChat(req,res){
    const {chatId}=req.params;

    if(!chatId){
        return res.status(404).json({
            message:"ChatId is required!"
        });
    }

    const chat=await chatModel.find({
        _id:chatId,
        user:req.user.id
    });

    if(!chat){
        return res.status(404).json({
            message:"Chat does not found!"
        })
    }

    res.status(200).json({
        success:true,
        chat:chat
    });
}

async function getMessage(req,res){
    const { chatId }=req.params;
     if(!chatId){
        return res.status(404).json({
            message:"ChatId is required!"
        });
    }

    const messages=await messageModel.find({
        chat:chatId
    });

    if(!messages){
        return res.status(404).json({
            message:"Messages does not found!"
        })
    }

    res.status(200).json({
        success:true,
        messages:messages
    });
}
async function getChatId(req,res){

    const chatIds=await chatModel.find({
        user:req.user.id
    })

    if(!chatIds){
        return res.status(404).json({
            message:"No chat History!"
        })
    }

    res.status(200).json({
        success:true,
        chats:chatIds
    });

}

async function getChatDelete(req,res){

    const { chatId }=req.params;
    if(!chatId){
        return res.status(400).json({
            message:"ChatId is required!"
        });
    }

    const chat=await chatModel.findByIdAndDelete(chatId);

    if(!chat){
        return res.status(404).json({
            message:"Chat does not found!"
        })
    }

    res.status(200).json({
        success:true,
        message:"Chat deleted successfully!"
    });
}

export { sendMessageUnified, getChat, getMessage, getChatId, getChatDelete };