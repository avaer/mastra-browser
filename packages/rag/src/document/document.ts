// Custom implementation of Document class
import type { Document as Chunk } from './types';

// Simple extractor classes to replace LlamaIndex extractors
class TitleExtractor {
  private options: Record<string, any>;
  
  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }
}

class SummaryExtractor {
  private options: Record<string, any>;
  
  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }
}

class QuestionsAnsweredExtractor {
  private options: Record<string, any>;
  
  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }
}

class KeywordExtractor {
  private options: Record<string, any>;
  
  constructor(options: Record<string, any> = {}) {
    this.options = options;
  }
}

// Simplified IngestionPipeline
class IngestionPipeline {
  private transformations: any[];
  
  constructor({ transformations }: { transformations: any[] }) {
    this.transformations = transformations;
  }
  
  async run({ documents }: { documents: Chunk[] }): Promise<Chunk[]> {
    // This is a no-op in our implementation since we've moved the extraction
    // functionality directly into the extractMetadata method
    return documents;
  }
}

import { CharacterTransformer, RecursiveCharacterTransformer } from './transformers/character';
import { HTMLHeaderTransformer, HTMLSectionTransformer } from './transformers/html';
import { RecursiveJsonTransformer } from './transformers/json';
import { LatexTransformer } from './transformers/latex';
import { MarkdownHeaderTransformer, MarkdownTransformer } from './transformers/markdown';
import { TokenTransformer } from './transformers/token';
import type { ChunkOptions, ChunkParams, ChunkStrategy, ExtractParams } from './types';

export class MDocument {
  private chunks: Chunk[];
  private type: string; // e.g., 'text', 'html', 'markdown', 'json'

  constructor({ docs, type }: { docs: { text: string; metadata?: Record<string, any> }[]; type: string }) {
    this.chunks = docs.map(d => {
      return { text: d.text, metadata: d.metadata || {} };
    });
    this.type = type;
  }

  async extractMetadata({ title, summary, questions, keywords }: ExtractParams): Promise<MDocument> {
    const transformations = [];

    if (typeof summary !== 'undefined') {
      transformations.push(new SummaryExtractor(typeof summary === 'boolean' ? {} : summary));
    }

    if (typeof questions !== 'undefined') {
      transformations.push(new QuestionsAnsweredExtractor(typeof questions === 'boolean' ? {} : questions));
    }

    if (typeof keywords !== 'undefined') {
      transformations.push(new KeywordExtractor(typeof keywords === 'boolean' ? {} : keywords));
    }

    if (typeof title !== 'undefined') {
      transformations.push(new TitleExtractor(typeof title === 'boolean' ? {} : title));
    }

    // Create our ingestion pipeline
    const pipeline = new IngestionPipeline({
      transformations,
    });
    
    // Process documents through the pipeline
    await pipeline.run({ documents: this.chunks });
    
    // Apply our basic metadata extraction logic
    this.chunks.map(doc => {
      const text = doc.text;
      const newMetadata: Record<string, any> = { ...doc.metadata };
      
      // Basic title extraction
      if (typeof title !== 'undefined') {
        // Simple heuristic: first line or first sentence could be the title
        const firstLine = text.split('\n')[0] ?? '';
        const firstSentence = text.split(/[.!?]/)[0] ?? '';
        newMetadata.title = firstLine.length < 100 ? firstLine : (firstSentence.length < 100 ? firstSentence : text.substring(0, 100));
      }
      
      // Basic summary extraction
      if (typeof summary !== 'undefined') {
        // Simple heuristic: first paragraph or first few sentences
        const firstParagraph = text.split('\n\n')[0] ?? '';
        newMetadata.summary = firstParagraph.length < 200 ? firstParagraph : text.substring(0, 200) + '...';
      }
      
      // Basic keyword extraction
      if (typeof keywords !== 'undefined') {
        // Simple heuristic: find common words excluding stopwords
        const stopwords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'but', 'is', 'are', 'was', 'were']);
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordCounts: Record<string, number> = {};
        
        words.forEach(word => {
          if (!stopwords.has(word) && word.length > 3) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
        
        const sortedWords = Object.entries(wordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([word]) => word);
        
        newMetadata.keywords = sortedWords;
      }
      
      // Basic question extraction
      if (typeof questions !== 'undefined') {
        // Simple heuristic: find sentences ending with question marks
        const questionSentences = text.match(/[^.!?]*\?/g) || [];
        newMetadata.questions = questionSentences.slice(0, 3);
      }
      
      // Update the chunk with new metadata
      return {
        text: doc.text,
        metadata: newMetadata
      };
    });

    return this;
  }

  static fromText(text: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text,
          metadata,
        },
      ],
      type: 'text',
    });
  }

  static fromHTML(html: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: html,
          metadata,
        },
      ],
      type: 'html',
    });
  }

  static fromMarkdown(markdown: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: markdown,
          metadata,
        },
      ],
      type: 'markdown',
    });
  }

  static fromJSON(jsonString: string, metadata?: Record<string, any>): MDocument {
    return new MDocument({
      docs: [
        {
          text: jsonString,
          metadata,
        },
      ],
      type: 'json',
    });
  }

  private defaultStrategy(): ChunkStrategy {
    switch (this.type) {
      case 'html':
        return 'html';
      case 'markdown':
        return 'markdown';
      case 'json':
        return 'json';
      case 'latex':
        return 'latex';
      default:
        return 'recursive';
    }
  }

  private async chunkBy(strategy: ChunkStrategy, options?: ChunkOptions): Promise<void> {
    switch (strategy) {
      case 'recursive':
        await this.chunkRecursive(options);
        break;
      case 'character':
        await this.chunkCharacter(options);
        break;
      case 'token':
        await this.chunkToken(options);
        break;
      case 'markdown':
        await this.chunkMarkdown(options);
        break;
      case 'html':
        await this.chunkHTML(options);
        break;
      case 'json':
        await this.chunkJSON(options);
        break;
      case 'latex':
        await this.chunkLatex(options);
        break;
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }

  async chunkRecursive(options?: ChunkOptions): Promise<void> {
    if (options?.language) {
      const rt = RecursiveCharacterTransformer.fromLanguage(options.language, options);
      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }

    const rt = new RecursiveCharacterTransformer({
      separators: options?.separators,
      isSeparatorRegex: options?.isSeparatorRegex,
      options,
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunkCharacter(options?: ChunkOptions): Promise<void> {
    const rt = new CharacterTransformer({
      separator: options?.separator,
      isSeparatorRegex: options?.isSeparatorRegex,
      options,
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunkHTML(options?: ChunkOptions): Promise<void> {
    if (options?.headers?.length) {
      const rt = new HTMLHeaderTransformer(options.headers, options?.returnEachLine);

      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }

    if (options?.sections?.length) {
      const rt = new HTMLSectionTransformer(options.sections);

      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }

    throw new Error('HTML chunking requires either headers or sections to be specified');
  }

  async chunkJSON(options?: ChunkOptions): Promise<void> {
    if (!options?.maxSize) {
      throw new Error('JSON chunking requires maxSize to be specified');
    }

    const rt = new RecursiveJsonTransformer({
      maxSize: options?.maxSize,
      minSize: options?.minSize,
    });

    const textSplit = rt.transformDocuments({
      documents: this.chunks,
      ensureAscii: options?.ensureAscii,
      convertLists: options?.convertLists,
    });

    this.chunks = textSplit;
  }

  async chunkLatex(options?: ChunkOptions): Promise<void> {
    const rt = new LatexTransformer(options);
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunkToken(options?: ChunkOptions): Promise<void> {
    const rt = TokenTransformer.fromTikToken({
      options,
      encodingName: options?.encodingName,
      modelName: options?.modelName,
    });
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunkMarkdown(options?: ChunkOptions): Promise<void> {
    if (options?.headers) {
      const rt = new MarkdownHeaderTransformer(options.headers, options?.returnEachLine, options?.stripHeaders);
      const textSplit = rt.transformDocuments(this.chunks);
      this.chunks = textSplit;
      return;
    }

    const rt = new MarkdownTransformer(options);
    const textSplit = rt.transformDocuments(this.chunks);
    this.chunks = textSplit;
  }

  async chunk(params?: ChunkParams): Promise<Chunk[]> {
    const { strategy: passedStrategy, extract, ...chunkOptions } = params || {};
    // Determine the default strategy based on type if not specified
    const strategy = passedStrategy || this.defaultStrategy();

    // Apply the appropriate chunking strategy
    await this.chunkBy(strategy, chunkOptions);

    if (extract) {
      await this.extractMetadata(extract);
    }

    return this.chunks;
  }

  getDocs(): Chunk[] {
    return this.chunks;
  }

  getText(): string[] {
    return this.chunks.map(doc => doc.text);
  }

  getMetadata(): Record<string, any>[] {
    return this.chunks.map(doc => doc.metadata);
  }
}
