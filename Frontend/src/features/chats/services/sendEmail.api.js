import axios from 'axios';

const api=axios.create({
    baseURL:"http://localhost:3000/api/email",
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