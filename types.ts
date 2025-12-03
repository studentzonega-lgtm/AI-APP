
export interface PageContent {
  page_number: number;
  text_content: string;
  tables_markdown: string[];
  figures_captions: string[];
  footnotes: string[];
  equations: string[];
}

export interface ResearchMetadata {
  title: string;
  authors: string[];
  year: string;
  keywords: string[];
  doi?: string;
}

export interface ExtractedDataset {
  metadata: ResearchMetadata;
  pages: PageContent[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type ViewOption = 'json' | 'raw_text';

export type ModelOption = 'gemini-3-pro-preview' | 'gemini-2.5-flash';
