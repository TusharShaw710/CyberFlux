import axios from "axios";
import fs from "fs";

export const analyzeImageWithMistral = async (filePath,fileType) => {
  const base64Image = fs.readFileSync(filePath, {
    encoding: "base64",
  });

  const response = await axios.post(
    "https://api.mistral.ai/v1/chat/completions",
    {
      model: "pixtral-12b",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this image in detail" },
            {
              type: "image_url",
              image_url: `data:${fileType};base64,${base64Image}`,
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_AI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};