export interface ResearchMetadata {
  title: string;
  authors: string[];
  year: string;
  keywords: string[];
}

export interface ResearchSection {
  heading: string;
  text: string;
  equations: string[];
  tables: string[];
  figures: string[];
}

export interface ResearchDatabase {
  metadata: ResearchMetadata;
  sections: ResearchSection[];
  references: string[];
}

export interface ParsedResponse {
  summary: string;
  latex: string;
  database: ResearchDatabase;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type TabOption = 'summary' | 'latex' | 'json';