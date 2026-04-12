import { PDFParse } from "pdf-parse";
import fs from "fs";

export const readPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({ data: buffer }); 
  const result = await parser.getText();

  await parser.destroy();

  return result.text.slice(0, 5000);
};