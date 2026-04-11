import {sendEmail} from "../services/sendEmail.api.js";

const useEmail=()=>{

    async function handleSendEmail(to,subject,message){
        await sendEmail(to,subject,message);
    }

    return { handleSendEmail };
}

export default useEmail;