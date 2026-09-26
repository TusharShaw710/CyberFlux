import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api=axios.create({
    baseURL: `${API_URL}/api/email`,
    withCredentials:true
});


async function sendEmail(to,subject,message){
    try {
        await api.post('/send-by-user',{ to, subject, message });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


export { sendEmail };