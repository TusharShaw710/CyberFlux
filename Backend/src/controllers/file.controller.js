import { processFileWithAI } from "../services/fileAI.service.js";

export const handleFileUpload = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    const result = await processFileWithAI(filePath, fileType);

    const finalResponse =
      result.messages?.at(-1)?.content || result;

    res.json({
      success: true,
      response: finalResponse,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "File processing failed" });
  }
};