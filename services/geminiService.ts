import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedDataset } from "../types";

const SYSTEM_INSTRUCTION = `
You are a High-Precision Research Data Extractor. 
Your ONLY goal is to convert the uploaded PDF research paper into a structured, machine-readable JSON dataset.
You must process the document PAGE BY PAGE.

STRICT RULES (NO HALLUCINATIONS):
1. DO NOT summarize. DO NOT interpret. DO NOT shorten text.
2. Extract the EXACT text content as it appears in the document.
3. If a page is empty, return an empty entry for that page.
4. Do not invent equations or numbers.
5. Your output must be a valid JSON object.

YOUR TASK:
Iterate through every single page of the PDF and extract:
- Page Number: The physical page index (1, 2, 3...).
- Text Content: The full raw text of the page, preserving reading order.
- Tables: Convert any tables on the page into Markdown format.
- Figure Captions: Extract ONLY the caption text (e.g., "Figure 1: Performance Graph"). Do not describe the image visually.
- Footnotes: Any footnotes found on that specific page.

METADATA EXTRACTION:
Also extract global metadata: Title, Authors, Year, Keywords, and DOI (if available).
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        authors: { type: Type.ARRAY, items: { type: Type.STRING } },
        year: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        doi: { type: Type.STRING, nullable: true },
      },
      required: ["title", "authors", "year", "keywords"],
    },
    pages: {
      type: Type.ARRAY,
      description: "Array containing extraction for every single page in the PDF.",
      items: {
        type: Type.OBJECT,
        properties: {
          page_number: { type: Type.INTEGER },
          text_content: { type: Type.STRING, description: "Full raw text of this page." },
          tables_markdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tables converted to Markdown." },
          figures_captions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Captions of figures on this page." },
          footnotes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["page_number", "text_content", "tables_markdown", "figures_captions", "footnotes"],
      },
    },
  },
  required: ["metadata", "pages"],
};

export const analyzePdf = async (base64Pdf: string, modelName: string): Promise<ExtractedDataset> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
          {
            text: "Perform a full page-by-page raw data extraction of this document. Return strictly formatted JSON.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const parsed = JSON.parse(responseText) as ExtractedDataset;
    return parsed;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
