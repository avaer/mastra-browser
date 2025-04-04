import type { TiktokenEncoding, TiktokenModel } from 'js-tiktoken';

// Custom Document class to replace LlamaIndex
export interface Document {
  text: string;
  metadata: Record<string, any>;
}

export enum Language {
  CPP = 'cpp',
  GO = 'go',
  JAVA = 'java',
  KOTLIN = 'kotlin',
  JS = 'js',
  TS = 'ts',
  PHP = 'php',
  PROTO = 'proto',
  PYTHON = 'python',
  RST = 'rst',
  RUBY = 'ruby',
  RUST = 'rust',
  SCALA = 'scala',
  SWIFT = 'swift',
  MARKDOWN = 'markdown',
  LATEX = 'latex',
  HTML = 'html',
  SOL = 'sol',
  CSHARP = 'csharp',
  COBOL = 'cobol',
  C = 'c',
  LUA = 'lua',
  PERL = 'perl',
  HASKELL = 'haskell',
  ELIXIR = 'elixir',
  POWERSHELL = 'powershell',
}

// Simple type definitions for extraction parameters
export type ExtractParams = {
  title?: TitleExtractorsArgs | boolean;
  summary?: SummaryExtractArgs | boolean;
  questions?: QuestionAnswerExtractArgs | boolean;
  keywords?: boolean | Record<string, any>;
};

export type ChunkOptions = {
  headers?: [string, string][];
  returnEachLine?: boolean;
  sections?: [string, string][];
  separator?: string;
  separators?: string[];
  isSeparatorRegex?: boolean;
  size?: number;
  maxSize?: number;
  minSize?: number;
  overlap?: number;
  lengthFunction?: (text: string) => number;
  keepSeparator?: boolean | 'start' | 'end';
  addStartIndex?: boolean;
  stripWhitespace?: boolean;
  language?: Language;
  ensureAscii?: boolean;
  convertLists?: boolean;
  encodingName?: TiktokenEncoding;
  modelName?: TiktokenModel;
  allowedSpecial?: Set<string> | 'all';
  disallowedSpecial?: Set<string> | 'all';
  stripHeaders?: boolean;
};

// Simplified template types for extraction
export type PromptTemplate = {
  template: string;
};

export type TitleExtractorsArgs = {
  llm?: any;
  nodes?: number;
  nodeTemplate?: string;
  combineTemplate?: string;
};

export type SummaryExtractArgs = {
  llm?: any;
  summaries?: string[];
  promptTemplate?: string;
};

export type QuestionAnswerExtractArgs = {
  llm?: any;
  questions?: number;
  promptTemplate?: string;
  embeddingOnly?: boolean;
};

export type KeywordExtractArgs = {
  llm?: any;
  keywords?: number;
  promptTemplate?: string;
};

export type ChunkStrategy = 'recursive' | 'character' | 'token' | 'markdown' | 'html' | 'json' | 'latex';

export interface ChunkParams extends ChunkOptions {
  strategy?: ChunkStrategy;
  extract?: ExtractParams;
}
