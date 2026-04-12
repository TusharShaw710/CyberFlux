import axios from 'axios';


const api=axios.create({
    baseURL:"https://cyberflux-yyap.onrender.com/api/chat",
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

        const response = await fetch('https://cyberflux-yyap.onrender.com/api/chat', {
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
                            // Split response into chunks for streaming animation
                            const token = data.content;
                            const words = token.split(' ');
                            
                            // Emit each word individually for typing effect
                            for (const word of words) {
                                if (word.trim()) {
                                    onToken(word + ' ');
                                    // Small delay between words for animation
                                    await new Promise(resolve => setTimeout(resolve, 30));
                                }
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