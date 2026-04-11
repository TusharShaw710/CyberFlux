import { google } from "googleapis";
import { oauth2Client } from "../utils/gmail.js";
import userEmailModel from "../models/userEmail.model.js";
import { cyberfluxTemplate } from "../utils/emailTemplate.js";
import {marked} from "marked";

export const sendEmailByUser = async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        const userId = req.user.id;

        // 1️⃣ Get user data from DB
        const user = await userEmailModel.findOne({ userId });

        if (!user) {
            return res.status(400).json({
                message: "Gmail not linked"
            });
        }

        // 2️⃣ Set refresh token
        oauth2Client.setCredentials({
            refresh_token: user.refresh_token
        });

        // 3️⃣ Create Gmail API instance
        const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client
        });

        const formattedMessage = marked.parse(message);
        const htmlMessage = cyberfluxTemplate({ message: formattedMessage });

        // 4️⃣ Format email
        const email = [
            `From: ${user.email}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            "Content-Type: text/html; charset=utf-8",
            htmlMessage
        ].join("\n");

        const encodedMessage = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // 5️⃣ Send email
        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage
            }
        });

        res.status(200).json({
            message: "Email sent! If the address is valid, the recipient will receive it shortly."
        });

    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({
            message: "Failed to send email"
        });
    }
};