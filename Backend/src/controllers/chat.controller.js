import { getResponse, getResponseStream, getChatTitle } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import chatModel from "../models/chat.model.js";
import { extractFileContent } from "../services/fileAI.service.js";

async function sendMessageUnified(req,res){
    try{
        const { message, chatId } = req.body || {};
        
        if(!message && !req.file){
            return res.status(400).json({
                message:"Message or file is required"
            });
        }

        // Set SSE headers (CORS is already handled by middleware)
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders?.();
        const streamAbort = new AbortController();
        const abortOnDisconnect = () => {
            if (!res.writableEnded) streamAbort.abort();
        };
        req.once('aborted', abortOnDisconnect);
        res.once('close', abortOnDisconnect);

        let title = null, chat = null;

        const rawMessage = (message || "").trim();
        const userPrompt = rawMessage || (req.file ? `[Attached File: ${req.file.originalname}]` : "");
        let fileContext = "";

        // Make the conversation visible immediately. Title generation and resource
        // extraction can take time, but neither needs to delay the SSE handshake.
        if (!chatId) {
            title = userPrompt.slice(0, 48) || "New Chat";
            chat = await chatModel.create({ title, user: req.user.id });
        } else {
            chat = await chatModel.findById(chatId);
        }

        res.write(`data: ${JSON.stringify({
            type: 'chat_info',
            chatId: chat._id,
            title: title || chat.title
        })}\n\n`);

        const generatedTitle = !chatId ? getChatTitle(userPrompt) : null;

        if (req.file) {
            try {
                fileContext = await extractFileContent(req.file.path, req.file.mimetype);
            } catch (err) {
                console.error("Error processing file", err);
            }
        }

        // Save user message with original prompt and separate file context/metadata
        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            role: "user",
            content: userPrompt,
            file: req.file ? {
                name: req.file.originalname,
                fileType: req.file.mimetype
            } : undefined,
            fileContext: fileContext || undefined
        });

        // Build model history from prior conversation only; keep the current request prompt/resource
        // separate so they are not folded into the user-visible chat history or leaked into future requests.
        const historicalMessages = await messageModel.find({ chat: chatId || chat._id }).sort({ createdAt: 1 });
        const priorMessages = historicalMessages.filter(msg => msg._id.toString() !== userMessage._id.toString());

        let fullResponse = '';
        let tokenCount = 0;
        let assistantSaved = false;

        try {
            // Stream the response incrementally as chunks arrive from the model while keeping
            // the current request prompt and resource context isolated from previous history.
            const streamedResponse = await getResponseStream(priorMessages, (token) => {
                fullResponse += token;
                if (res.destroyed || res.writableEnded) return;
                tokenCount++;
                res.write(`data: ${JSON.stringify({
                    type: 'token',
                    content: token
                })}\n\n`);
            }, userPrompt, fileContext, streamAbort.signal);
            fullResponse = streamedResponse;

            // Save final AI message
            await messageModel.create({
                chat: chatId || chat._id,
                role: "assistant",
                content: fullResponse
            });
            assistantSaved = true;

            if (generatedTitle) {
                title = await generatedTitle;
                await chatModel.findByIdAndUpdate(chat._id, { title });
                if (!res.destroyed && !res.writableEnded) {
                    res.write(`data: ${JSON.stringify({ type: 'title_update', title })}\n\n`);
                }
            }

            // Send completion event
            res.write(`data: ${JSON.stringify({
                type: 'done',
                totalTokens: tokenCount
            })}\n\n`);

            res.end();
        } catch(streamErr){
            if (fullResponse.trim() && !assistantSaved) {
                await messageModel.create({
                    chat: chatId || chat._id,
                    role: "assistant",
                    content: fullResponse
                });
            }
            if (res.destroyed || res.writableEnded || streamAbort.signal.aborted) return;
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
