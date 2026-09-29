import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api=axios.create({
    baseURL: `${API_URL}/api/chat`,
    withCredentials:true
});

// Streaming version using fetch with ReadableStream
async function sendMessageStream(message, chatId, file, onToken, onComplete, onError) {
    let completeCalled = false;

    try {
        const formData = new FormData();
        if (message) formData.append('message', message);
        if (chatId) formData.append('chatId', chatId);
        if (file) formData.append('file', file);

        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                if (onComplete && !completeCalled) {
                    completeCalled = true;
                    onComplete({ totalTokens: 0 });
                }
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            
            // Process all complete messages in the buffer
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i];
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.replace('data: ', ''));
                        
                        if (data.type === 'token') {
                            const token = data.content;
                            if (typeof token === 'string' && token.trim()) {
                                onToken(token);
                            }
                        } else if (data.type === 'chat_info') {
                            onToken({ type: 'chat_info', chatId: data.chatId, title: data.title });
                        } else if (data.type === 'done') {
                            if (onComplete && !completeCalled) {
                                completeCalled = true;
                                onComplete(data);
                            }
                        } else if (data.type === 'error') {
                            if (onError) onError(new Error(data.message));
                        }
                    } catch (parseErr) {
                        console.error('Error parsing SSE data:', parseErr);
                    }
                }
            }
            
            // Keep the last incomplete line in the buffer
            buffer = lines[lines.length - 1];
        }
    } catch (error) {
        console.error('Error setting up stream:', error);
        if (onError) onError(error);
    }
}

async function getMessage(chatId){
    try{
        const response=await api.get(`/get-messages/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

async function getChatId(){
    try{
        const response=await api.get(`/get-chat-id`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat ID:', error);
        throw error;
    }
}

async function getChat(chatId){
    try{
        const response=await api.get(`/get-chat/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat:', error);
        throw error;
    }
}


async function deleteChat(chatId){
    try{
        const response=await api.get(`/delete-chat/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    }
}



export { sendMessageStream, getMessage, getChatId, getChat, deleteChat };