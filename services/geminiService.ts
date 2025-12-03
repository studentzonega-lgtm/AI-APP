import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ParsedResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are an AI system that converts uploaded research papers (PDFs) into a fully structured, AI-readable representation.
The goal is to help the user create a searchable research database and generate literature reviews for thesis writing.

Your tasks:
PDF Ingestion & Understanding
Read the entire document deeply.
Identify & extract the following accurately:
Title, Authors, Abstract, Keywords, Section headings, Sub-sections, Paragraphs, Equations, Tables, Figures (with captions), References.

Output Format (Very Important):
You must return a JSON object containing three distinct parts:
1. "summary": A clean research summary in Markdown.
   - Overview
   - Problem statement
   - Methodology
   - Results
   - Limitations
   - Key findings
   - Future scope
2. "latex": The full paper converted to LaTeX format.
   - Inline math -> $ ... $
   - Display math -> [ ... ]
   - Tables -> \\begin{table}...\\end{table}
   - Figures -> \\begin{figure}...\\end{figure}
   - References -> BibTeX style
3. "database": A structured JSON object for a research database.
   - metadata: { title, authors, year, keywords }
   - sections: array of { heading, text, equations, tables, figures }
   - references: array of strings

Rules:
- Never hallucinate equations, tables, or numbers.
- Maintain accuracy above creativity.
- Tone: Professional academic.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "The clean research summary in Markdown format with headers like Overview, Problem Statement, etc.",
    },
    latex: {
      type: Type.STRING,
      description: "The full content of the paper converted to a valid LaTeX document source code.",
    },
    database: {
      type: Type.OBJECT,
      description: "The structured JSON database representation.",
      properties: {
        metadata: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            authors: { type: Type.ARRAY, items: { type: Type.STRING } },
            year: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "authors", "year", "keywords"],
        },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING },
              text: { type: Type.STRING },
              equations: { type: Type.ARRAY, items: { type: Type.STRING } },
              tables: { type: Type.ARRAY, items: { type: Type.STRING } },
              figures: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["heading", "text"],
          },
        },
        references: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["metadata", "sections", "references"],
    },
  },
  required: ["summary", "latex", "database"],
};

export const analyzePdf = async (base64Pdf: string): Promise<ParsedResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Using gemini-3-pro-preview for complex reasoning and large context handling suitable for research papers
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
          {
            text: "Analyze this research paper and extract the required information according to the system instructions.",
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

    const parsed = JSON.parse(responseText) as ParsedResponse;
    return parsed;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
