import { readPDF } from "../utils/fileTools.js";
import { analyzeImageWithMistral } from "./vision.service.js";
import { agent } from "./ai.service.js";
import { HumanMessage,SystemMessage } from "langchain";


export const processFileWithAI = async (filePath, fileType) => {
  let content = "";

  if (fileType === "application/pdf") {
    content = await readPDF(filePath);

  } else if (fileType.startsWith("image/")) {
    content = await analyzeImageWithMistral(filePath,fileType);
  }else {
    throw new Error("Unsupported file type");
  }

  const response = await agent.invoke({
    messages: [
            new SystemMessage(`
                You are an AI assistant.

                - Analyze the given content carefully
                - Provide clear and helpful explanation
                - If it is a document → summarize + explain
                - If it is an image → describe and interpret
                    `),

            new HumanMessage(`Analyze the following content:${content}`)
        ]
  });

  let finalResponse = "";

  if (response.messages && response.messages.length > 0) {
    finalResponse = response.messages.at(-1).content;
  } else if (typeof response === "string") {
    finalResponse = response;
  } else if (response.content) {
    finalResponse = response.content;
  } else if (response.output) {
    finalResponse = response.output;
  }

  if (!finalResponse || typeof finalResponse !== "string") {
    finalResponse = "I couldn't process the uploaded file properly.";
  }

  
  return finalResponse;
};