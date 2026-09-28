import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';
import { searchWeb } from "./internet.service.js";
import { tool, createAgent } from "langchain";
import * as z from "zod";

dotenv.config();

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  streaming: true
});

const titleModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  streaming: false
});

const searchInternetTool = tool(
  searchWeb,
  {
    name: "searchInternet",
    description: "Search the internet for ANY real-time or latest information.Use this tool when:- The question involves current events- The answer may have changed recently- The information is unknown or uncertain- The user asks for latest updates, schedules, news, or live dataThis tool is capable of retrieving IPL schedules, sports data, news, and real-time updates.",
    schema: z.object({
      query: z.string().describe("The search query string")
    })
  }
);

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool]
});

async function getResponse(messages) {
  try {
    const formattedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });

    const geminiResponse = await agent.invoke({
      messages: [
        new SystemMessage(`You are an AI assistant.
                            RULES:
                            - If the question involves current events, latest info, or unknown facts → MUST use the "searchInternet" tool.
                            - Do NOT guess.
                            - Always prefer tool over assumptions.
`),
        ...formattedMessages
      ]
    });
    return geminiResponse.messages[geminiResponse.messages.length - 1].content;
  } catch (err) {
    console.error('Error invoking Gemini model:', err);
    throw new Error('Failed to get AI response: ' + err.message);
  }
}

// Streaming version with callback for token handling
async function getResponseStream(messages, onToken) {
  try {
    const formattedMessages = messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });

    // Use invoke instead of stream since agent with tools needs to execute sequentially
    const agentResponse = await agent.invoke({
      messages: [
        new SystemMessage(`You are an AI assistant.
                            RULES:
                            - If the question involves current events, latest info, or unknown facts → MUST use the "searchInternet" tool.
                            - Do NOT guess.
                            - Always prefer tool over assumptions.
`),
        ...formattedMessages
      ]
    });

    // Extract the response content
    let fullResponse = '';

    if (agentResponse.messages && agentResponse.messages.length > 0) {
      // Get the last message (AI response)
      const lastMessage = agentResponse.messages[agentResponse.messages.length - 1];
      fullResponse = lastMessage.content || '';
    } else if (typeof agentResponse === 'string') {
      fullResponse = agentResponse;
    } else if (agentResponse.content) {
      fullResponse = agentResponse.content;
    } else if (agentResponse.output) {
      fullResponse = agentResponse.output;
    }

    // Guard: ensure fullResponse is not empty
    fullResponse = String(fullResponse || '');

    if (!fullResponse.trim()) {
      fullResponse = "I couldn't process your request. Please try again.";
    }

    // Emit the complete response as a single token
    // This avoids duplication of the message
    if (onToken) {
      onToken(fullResponse);
    }

    return fullResponse;
  } catch (err) {
    console.error('Error invoking streaming agent:', err);
    throw new Error('Failed to get AI response: ' + err.message);
  }
}

async function getChatTitle(message) {
  try {
    const response = await titleModel.invoke([
      new SystemMessage("You are a helpful assistant that generates concise and descriptive titles for user queries."),
      new HumanMessage(`Generate a concise title for the following user query in 2-4 words: "${message}"`)
    ]);

    const titleText = typeof response.content === 'string' ? response.content.trim() : String(response.content || '').trim();
    return titleText || (message ? message.trim().slice(0, 30) : "New Chat");
  } catch (error) {
    console.error('Error invoking ChatTitle model:', error.message);
    // Return a safe fallback title to satisfy database validation
    return message ? message.trim().slice(0, 30) : "New Chat";
  }
}

export { getResponse, getResponseStream, getChatTitle, agent };