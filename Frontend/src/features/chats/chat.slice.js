import { createSlice } from "@reduxjs/toolkit";



const chatSlice=createSlice({
    name:"chat",
    initialState:{
        chats: {},
        currentChatId: null,
        isloading:false,
        error:null,
        isThinking: false,
        streamingMessage: '',
        streamingMessageRole: 'ai',
        isGmailConnected: false
    },
    reducers:{
        createNewChat:(state,action)=>{
            const {chatId,title}=action.payload;
            state.chats[chatId]={
                id:chatId,
                title:title,
                messages:[],
                updatedAt:new Date().toISOString()
            }
        },
        addNewMessage:(state,action)=>{
            const {chatId,message,role}=action.payload;
            // Guard: only add message if chat exists
            if(state.chats[chatId]){
                // Prevent duplicate messages - check if last message has same content
                const messages = state.chats[chatId].messages;
                const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                
                // Don't add if it's a duplicate of the last message (same role and content)
                if (!lastMessage || lastMessage.role !== role || lastMessage.text !== message) {
                    state.chats[chatId].messages.push({text:message,role:role});
                    state.chats[chatId].updatedAt=new Date().toISOString();
                }
            }
        },
        addMessages:(state,action)=>{
            const {chatId,messages}=action.payload;
            if(state.chats[chatId]){
                state.chats[chatId].messages.push(...messages);
                state.chats[chatId].updatedAt=new Date().toISOString();
            }
        },
        setChats:(state,action)=>{
            state.chats=action.payload;
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload;
        },
        setLoading:(state,action)=>{
            state.isloading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setThinking:(state,action)=>{
            state.isThinking=action.payload;
        },
        setStreamingMessage:(state,action)=>{
            state.streamingMessage=action.payload;
        },
        addStreamingToken:(state,action)=>{
            state.streamingMessage+=action.payload;
        },
        clearStreamingMessage:(state)=>{
            state.streamingMessage='';
            state.isThinking=false;
        },
        setGmailConnected:(state,action)=>{
            state.isGmailConnected=action.payload;
        }
    }
})

export const {setChats,setCurrentChatId,setLoading,setError,createNewChat,addNewMessage,addMessages,setThinking,setStreamingMessage,addStreamingToken,clearStreamingMessage,setGmailConnected}=chatSlice.actions;

export default chatSlice.reducer;