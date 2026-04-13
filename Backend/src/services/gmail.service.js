import { google } from 'googleapis';
import { oauth2Client } from '../utils/gmail.js';
import dotenv from 'dotenv';

dotenv.config();

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function sendEmail(to, subject, html, text = '') {
    try {
        const emailLines = [
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html
        ];

        const email = emailLines.join('\r\n');
        
        // Base64Url encode string
        const base64EncodedEmail = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: base64EncodedEmail
            }
        });

        console.log(`Email sent successfully to ${to}, Message ID: ${res.data.id}`);
        return res.data;
    } catch (error) {
        console.error('Error sending email out via Gmail API:', error);
        throw error;
    }
}