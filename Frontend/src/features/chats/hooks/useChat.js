import { initClient } from "../services/chat.socket";
import { sendMessageStream, getMessage, getChat, getChatId, deleteChat } from "../services/chat.api";
import { useDispatch } from "react-redux";
import { setLoading, setChats, setCurrentChatId, setError, createNewChat, addNewMessage, addMessages, setThinking, addStreamingToken, clearStreamingMessage } from "../chat.slice";

const useChat=()=>{
    const dispatch=useDispatch();


    async function handleSendMessageStream(message, chatId, file) {
        dispatch(setThinking(true));
        let streamStarted = false;
        let finalChatId = chatId;
        let fullResponseMessage = '';
        let messageAdded = false;

        try {
            sendMessageStream(
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
                            dispatch(addNewMessage({
                                chatId: finalChatId,
                                message: message,
                                role: "user"
                            }));
                            streamStarted = true;
                        }
                    } else if (typeof token === 'string') {
                        // Accumulate the full response
                        fullResponseMessage += token;
                        
                        // Transition from thinking to streaming on first token
                        dispatch(setThinking(false));
                        dispatch(addStreamingToken(token));
                    }
                },
                (completeData) => {
                    // Stream completed - clear streaming first, then add to messages
                    dispatch(clearStreamingMessage());
                    
                    // Only add message if it hasn't been added yet and has content
                    if (!messageAdded && fullResponseMessage.trim()) {
                        dispatch(addNewMessage({
                            chatId: finalChatId,
                            message: fullResponseMessage,
                            role: "ai"
                        }));
                        messageAdded = true;
                    }
                },
                (error) => {
                    console.error('Stream error:', error);
                    dispatch(setError("Failed to stream message. Please try again."));
                    dispatch(clearStreamingMessage());
                }
            );
        } catch (err) {
            console.log(err);
            dispatch(setError("Failed to send message. Please try again."));
            dispatch(clearStreamingMessage());
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
                        text:msg.content,
                        role:msg.role
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


    return { handleSendMessageStream, initClient, handleGetChat, openChat, handleDeleteChat, handleSendEmail };
}

export default useChat;