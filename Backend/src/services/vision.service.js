import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import fs from "fs";

export const analyzeImageWithGemini = async (filePath, fileType) => {
  const base64Image = fs.readFileSync(filePath, {
    encoding: "base64",
  });

  const visionModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await visionModel.invoke([
    new HumanMessage({
      content: [
        { type: "text", text: "Describe this image in detail" },
        {
          type: "image_url",
          image_url: `data:${fileType};base64,${base64Image}`,
        },
      ],
    }),
  ]);

  const content = typeof response.content === 'string' ? response.content : String(response.content || '');
  return content;
};

// Alias for backwards compatibility
export const analyzeImageWithMistral = analyzeImageWithGemini;