import { initClient } from "../services/chat.socket";
import { sendMessageStream, getMessage, getChat, getChatId, deleteChat } from "../services/chat.api";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { setLoading, setChats, setCurrentChatId, setError, createNewChat, updateChatTitle, addNewMessage, addMessages, setThinking, startStreamingMessage, addStreamingToken, clearStreamingMessage } from "../chat.slice";

const useChat=()=>{
    const dispatch=useDispatch();
    const abortControllerRef = useRef(null);
    const pendingTokensRef = useRef('');
    const animationFrameRef = useRef(null);

    function flushPendingTokens() {
        if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
        if (pendingTokensRef.current) {
            dispatch(addStreamingToken(pendingTokensRef.current));
            pendingTokensRef.current = '';
        }
    }

    function stopGeneration() {
        abortControllerRef.current?.abort();
    }


    async function handleSendMessageStream(message, chatId, file) {
        dispatch(setThinking(true));
        dispatch(startStreamingMessage());
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        let streamStarted = false;
        let finalChatId = chatId;
        let fullResponseMessage = '';
        let messageAdded = false;
        let thinkingDismissed = false;

        try {
            await sendMessageStream(
                message,
                chatId,
                file,
                (token) => {
                    // Handle different token types
                    if (typeof token === 'object' && token.type === 'chat_info') {
                        // Chat info received
                        finalChatId = token.chatId || chatId;
                        
                        // Create new chat first if this was a first message
                        if (!chatId) {
                            dispatch(createNewChat({
                                chatId: finalChatId,
                                title: token.title,
                                updatedAt: new Date().toISOString()
                            }));
                            dispatch(setCurrentChatId(finalChatId));
                        }
                        
                        // Add user message after chat is created
                        if (!streamStarted) {
                            const userDisplayPrompt = message.trim() || (file ? `[Attached File: ${file.name}]` : "");
                            dispatch(addNewMessage({
                                chatId: finalChatId,
                                message: userDisplayPrompt,
                                role: "user",
                                file: file ? { name: file.name, fileType: file.type } : null
                            }));
                            streamStarted = true;
                        }
                        dispatch(setThinking(false));
                    } else if (typeof token === 'object' && token.type === 'title_update') {
                        dispatch(updateChatTitle({ chatId: finalChatId, title: token.title }));
                    } else if (typeof token === 'string') {
                        // Accumulate the full response
                        fullResponseMessage += token;

                        if (!thinkingDismissed) {
                            dispatch(setThinking(false));
                            thinkingDismissed = true;
                        }
                        pendingTokensRef.current += token;
                        if (animationFrameRef.current === null) {
                            animationFrameRef.current = requestAnimationFrame(flushPendingTokens);
                        }
                    }
                },
                (completeData) => {
                    // Stream completed - clear streaming first, then add to messages
                    flushPendingTokens();
                    dispatch(clearStreamingMessage());
                    
                    // Only add message if it hasn't been added yet and has content
                    if (!messageAdded && fullResponseMessage.trim()) {
                        dispatch(addNewMessage({
                            chatId: finalChatId,
                            message: fullResponseMessage,
                            role: "assistant"
                        }));
                        messageAdded = true;
                    }
                },
                (error) => {
                    console.error('Stream error:', error);
                    flushPendingTokens();
                    dispatch(setError("Failed to stream message. Please try again."));
                    dispatch(clearStreamingMessage());
                    if (!messageAdded && fullResponseMessage.trim() && finalChatId) {
                        dispatch(addNewMessage({
                            chatId: finalChatId,
                            message: fullResponseMessage,
                            role: "assistant"
                        }));
                        messageAdded = true;
                    }
                },
                abortController.signal
            );
        } catch (err) {
            console.log(err);
            flushPendingTokens();
            dispatch(setError("Failed to send message. Please try again."));
            dispatch(clearStreamingMessage());
        } finally {
            if (abortControllerRef.current === abortController) abortControllerRef.current = null;
        }
    }

    async function handleGetChat() {
        dispatch(setLoading(true));
        try {
          const data = await getChatId();
          const { chats } = data;
          const chatMap=chats.reduce((acc,chat)=>{
            acc[chat._id]={
                id:chat._id,
                title:chat.title,
                messages:[],
                updatedAt:chat.updatedAt
            };
            return acc;
          },{});
            dispatch(setChats(chatMap));          
        } catch (err) {
          console.log(err);
          dispatch(setError("Failed to get chat. Please try again."));
        } finally {
          dispatch(setLoading(false));
        }
    }

    async function openChat(chatId,chats){
        dispatch(setLoading(true));

        try {
            if(chats[chatId]?.messages.length===0) {
                const {messages}=await getMessage(chatId);
                const formatMessages=messages.map((msg)=>{
                    return {
                        _id: msg._id,
                        text: msg.content,
                        role: msg.role === 'assistant' ? 'assistant' : msg.role,
                        file: msg.file || null
                    }
                });

                dispatch(addMessages({
                    chatId:chatId,
                    messages:formatMessages
                }));
            }           
            dispatch(setCurrentChatId(chatId));
        } catch (error) {
            console.log(error);
        }finally{
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteChat(chatId){
        try {
            await deleteChat(chatId);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    }

    async function handleSendEmail(to,subject,message){
        try{
            await sendEmail(to,subject,message);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }


    return { handleSendMessageStream, stopGeneration, initClient, handleGetChat, openChat, handleDeleteChat, handleSendEmail };
}

export default useChat;
