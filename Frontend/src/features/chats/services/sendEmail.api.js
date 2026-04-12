import axios from 'axios';

const api=axios.create({
    baseURL:"https://cyberflux-yyap.onrender.com/api/email",
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