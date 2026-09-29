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

const SYSTEM_PROMPT = `You are an AI assistant.
RULES:
- If the question involves current events, latest info, or unknown facts → MUST use the "searchInternet" tool.
- Do NOT guess.
- Always prefer tool over assumptions.`;

function normalizeMessageContent(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(normalizeMessageContent).join('');

  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.content === 'string') return value.content;
    if (Array.isArray(value.content)) return value.content.map(normalizeMessageContent).join('');
    if (typeof value.delta === 'string') return value.delta;
    if (Array.isArray(value.delta)) return value.delta.map(normalizeMessageContent).join('');
    if (typeof value.output === 'string') return value.output;
  }

  return '';
}

function buildModelMessageHistory(historyMessages, currentUserPrompt, resourceContext) {
  const messages = [new SystemMessage(SYSTEM_PROMPT)];

  for (const message of historyMessages || []) {
    const content = normalizeMessageContent(message?.content || '').trim();
    if (!content) continue;

    if (message?.role === 'user') {
      messages.push(new HumanMessage(content));
    } else if (message?.role === 'assistant' || message?.role === 'ai') {
      messages.push(new AIMessage(content));
    }
  }

  if (currentUserPrompt && currentUserPrompt.trim()) {
    messages.push(new HumanMessage(currentUserPrompt.trim()));
  }

  if (resourceContext && resourceContext.trim()) {
    messages.push(new HumanMessage(`Attached resource context:\n${resourceContext.trim()}`));
  }

  return messages;
}

async function getResponse(messages) {
  try {
    const geminiResponse = await agent.invoke({
      messages: buildModelMessageHistory(messages, null, null)
    });
    return geminiResponse.messages[geminiResponse.messages.length - 1].content;
  } catch (err) {
    console.error('Error invoking Gemini model:', err);
    throw new Error('Failed to get AI response: ' + err.message);
  }
}

function extractAssistantText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map(extractAssistantText).join('');
  }

  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text;
    if (typeof value.content === 'string') return value.content;
    if (Array.isArray(value.content)) {
      return value.content
        .map(item => {
          if (typeof item === 'string') return item;
          if (item && typeof item.text === 'string') return item.text;
          if (item && item.type === 'text' && typeof item.text === 'string') return item.text;
          return '';
        })
        .join('');
    }
    if (typeof value.delta === 'string') return value.delta;
    if (typeof value.output === 'string') return value.output;
    if (typeof value.result === 'string') return value.result;

    if (Array.isArray(value.messages)) {
      const lastMessage = value.messages[value.messages.length - 1];
      return extractAssistantText(lastMessage);
    }
  }

  return '';
}

// Streaming version with callback for token handling
async function getResponseStream(messages, onToken, currentUserPrompt = '', resourceContext = '', signal) {
  try {
    const input = {
      messages: buildModelMessageHistory(messages, currentUserPrompt, resourceContext)
    };

    let fullResponse = '';

    if (!agent || typeof agent.stream !== 'function') throw new Error('The configured AI agent does not support streaming');

    // Agent .stream() emits graph state updates. streamEvents() emits the
    // underlying chat model's actual chunks while it is generating.
    const stream = await agent.streamEvents(input, { version: 'v2', signal });
    for await (const event of stream) {
      if (event?.event !== 'on_chat_model_stream') continue;
      const chunkText = extractAssistantText(event.data?.chunk);
      if (!chunkText) continue;
      fullResponse += chunkText;
      onToken?.(chunkText);
    }

    if (!fullResponse.trim()) throw new Error('The AI response stream completed without assistant text');

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
