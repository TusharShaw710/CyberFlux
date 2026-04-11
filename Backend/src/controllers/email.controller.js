import { google } from "googleapis";
import { oauth2Client } from "../utils/gmail.js";
import UserEmail from "../models/userEmail.model.js";

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    // 1. Get logged-in userId (from auth middleware)
    const userId = req.user.id;

    // 2. Fetch user's Gmail data from DB
    const user = await UserEmail.findOne({ userId });

    if (!user || !user.refresh_token) {
      return res.status(400).json({
        message: "Gmail not connected",
      });
    }

    // 3. Set credentials using stored refresh token
    oauth2Client.setCredentials({
      refresh_token: user.refresh_token,
    });

    // 4. Create Gmail instance
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // 5. Create email message
    const message = [
      `From: ${user.email}`, // optional but good
      `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${subject}`,
      "",
      text,
    ].join("\n");

    // 6. Encode message
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    // 7. Send email
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    // 8. Response
    res.status(200).json({
      success: true,
      messageId: response.data.id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send email",
    });
  }
};