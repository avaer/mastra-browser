import { createTool } from '@mastra/core/tools';
import type { EmbeddingModel } from 'ai';
import type { MastraLanguageModel } from '@mastra/core/agent';
import type { MastraVector } from '@mastra/core/vector';
import type { QueryResult } from '@mastra/core/vector';
import type { TiktokenEncoding } from 'js-tiktoken';
import type { TiktokenModel } from 'js-tiktoken';
import type { VectorFilter } from '@mastra/core/vector/filter';

/**
 * Vector store specific prompts that detail supported operators and examples.
 * These prompts help users construct valid filters for each vector store.
 */
declare const ASTRA_PROMPT = "When querying Astra, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n- $all: Match all values in array\n  Example: { \"tags\": { \"$all\": [\"premium\", \"sale\"] } }\n\nLogical Operators:\n- $and: Logical AND (can be implicit or explicit)\n  Implicit Example: { \"price\": { \"$gt\": 100 }, \"category\": \"electronics\" }\n  Explicit Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n- $not: Logical NOT\n  Example: { \"$not\": { \"category\": \"electronics\" } }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nSpecial Operators:\n- $size: Array length check\n  Example: { \"tags\": { \"$size\": 2 } }\n\nRestrictions:\n- Regex patterns are not supported\n- Only $and, $or, and $not logical operators are supported\n- Nested fields are supported using dot notation\n- Multiple conditions on the same field are supported with both implicit and explicit $and\n- Empty arrays in $in/$nin will return no results\n- A non-empty array is required for $all operator\n- Only logical operators ($and, $or, $not) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- $not operator:\n  - Must be an object\n  - Cannot be empty\n  - Can be used at field level or top level\n  - Valid: { \"$not\": { \"field\": \"value\" } }\n  - Valid: { \"field\": { \"$not\": { \"$eq\": \"value\" } } }\n- Other logical operators ($and, $or):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\n\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gte\": 100, \"$lte\": 1000 } },\n    { \"tags\": { \"$all\": [\"premium\"] } },\n    { \"rating\": { \"$exists\": true, \"$gt\": 4 } },\n    { \"$or\": [\n      { \"stock\": { \"$gt\": 0 } },\n      { \"preorder\": true }\n    ]}\n  ]\n}";
export { ASTRA_PROMPT }
export { ASTRA_PROMPT as ASTRA_PROMPT_alias_1 }

export declare class CharacterTransformer extends TextTransformer {
    protected separator: string;
    protected isSeparatorRegex: boolean;
    constructor({ separator, isSeparatorRegex, options, }: {
        separator?: string;
        isSeparatorRegex?: boolean;
        options?: {
            size?: number;
            overlap?: number;
            lengthFunction?: (text: string) => number;
            keepSeparator?: boolean | 'start' | 'end';
            addStartIndex?: boolean;
            stripWhitespace?: boolean;
        };
    });
    splitText({ text }: {
        text: string;
    }): string[];
    private __splitChunk;
}

declare const CHROMA_PROMPT = "When querying Chroma, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n\nLogical Operators:\n- $and: Logical AND\n  Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n\nRestrictions:\n- Regex patterns are not supported\n- Element operators are not supported\n- Only $and and $or logical operators are supported\n- Nested fields are supported using dot notation\n- Multiple conditions on the same field are supported with both implicit and explicit $and\n- Empty arrays in $in/$nin will return no results\n- If multiple top-level fields exist, they're wrapped in $and\n- Only logical operators ($and, $or) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n  Invalid: { \"$in\": [...] }\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- Logical operators ($and, $or):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gte\": 100, \"$lte\": 1000 } },\n    { \"$or\": [\n      { \"inStock\": true },\n      { \"preorder\": true }\n    ]}\n  ]\n}";
export { CHROMA_PROMPT }
export { CHROMA_PROMPT as CHROMA_PROMPT_alias_1 }

declare type ChunkOptions = {
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
export { ChunkOptions }
export { ChunkOptions as ChunkOptions_alias_1 }

declare interface ChunkParams extends ChunkOptions {
    strategy?: ChunkStrategy;
    extract?: ExtractParams;
}
export { ChunkParams }
export { ChunkParams as ChunkParams_alias_1 }

declare type ChunkStrategy = 'recursive' | 'character' | 'token' | 'markdown' | 'html' | 'json' | 'latex';
export { ChunkStrategy }
export { ChunkStrategy as ChunkStrategy_alias_1 }

declare const createDocumentChunkerTool: ({ doc, params, }: {
    doc: MDocument;
    params?: ChunkParams;
}) => ReturnType<typeof createTool>;
export { createDocumentChunkerTool }
export { createDocumentChunkerTool as createDocumentChunkerTool_alias_1 }
export { createDocumentChunkerTool as createDocumentChunkerTool_alias_2 }

declare const createGraphRAGTool: ({ vectorStoreName, indexName, model, enableFilter, graphOptions, id, description, }: {
    vectorStoreName: string;
    indexName: string;
    model: EmbeddingModel<string>;
    enableFilter?: boolean;
    graphOptions?: {
        dimension?: number;
        randomWalkSteps?: number;
        restartProb?: number;
        threshold?: number;
    };
    id?: string;
    description?: string;
}) => ReturnType<typeof createTool>;
export { createGraphRAGTool }
export { createGraphRAGTool as createGraphRAGTool_alias_1 }
export { createGraphRAGTool as createGraphRAGTool_alias_2 }

declare const createVectorQueryTool: ({ vectorStoreName, indexName, model, enableFilter, reranker, id, description, }: {
    vectorStoreName: string;
    indexName: string;
    model: EmbeddingModel<string>;
    enableFilter?: boolean;
    reranker?: RerankConfig;
    id?: string;
    description?: string;
}) => ReturnType<typeof createTool>;
export { createVectorQueryTool }
export { createVectorQueryTool as createVectorQueryTool_alias_1 }
export { createVectorQueryTool as createVectorQueryTool_alias_2 }

declare const defaultGraphRagDescription: () => string;
export { defaultGraphRagDescription }
export { defaultGraphRagDescription as defaultGraphRagDescription_alias_1 }
export { defaultGraphRagDescription as defaultGraphRagDescription_alias_2 }

declare const defaultVectorQueryDescription: () => string;
export { defaultVectorQueryDescription }
export { defaultVectorQueryDescription as defaultVectorQueryDescription_alias_1 }
export { defaultVectorQueryDescription as defaultVectorQueryDescription_alias_2 }

declare interface Document {
    text: string;
    metadata: Record<string, any>;
}
export { Document }
export { Document as Document_alias_1 }

declare type ExtractParams = {
    title?: TitleExtractorsArgs | boolean;
    summary?: SummaryExtractArgs | boolean;
    questions?: QuestionAnswerExtractArgs | boolean;
    keywords?: boolean | Record<string, any>;
};
export { ExtractParams }
export { ExtractParams as ExtractParams_alias_1 }

declare const filterDescription = "JSON-formatted criteria to refine search results.\n- ALWAYS provide a filter value\n- If no filter is provided, use the default (\"{}\")\n- MUST be a valid, complete JSON object with proper quotes and brackets\n- Uses provided filter if specified\n- Default: \"{}\" (no filtering)\n- Example for no filtering: \"filter\": \"{}\"\n- Example: '{\"category\": \"health\"}'\n- Based on query intent\n- Do NOT use single quotes or unquoted properties\n- IMPORTANT: Always ensure JSON is properly closed with matching brackets\n- Multiple filters can be combined";
export { filterDescription }
export { filterDescription as filterDescription_alias_1 }
export { filterDescription as filterDescription_alias_2 }

export declare interface GraphChunk {
    text: string;
    metadata: Record<string, any>;
}

export declare interface GraphEdge {
    source: string;
    target: string;
    weight: number;
    type: SupportedEdgeType;
}

export declare interface GraphEmbedding {
    vector: number[];
}

export declare interface GraphNode {
    id: string;
    content: string;
    embedding?: number[];
    metadata?: Record<string, any>;
}

declare class GraphRAG {
    private nodes;
    private edges;
    private dimension;
    private threshold;
    constructor(dimension?: number, threshold?: number);
    addNode(node: GraphNode): void;
    addEdge(edge: GraphEdge): void;
    getNodes(): GraphNode[];
    getEdges(): GraphEdge[];
    getEdgesByType(type: string): GraphEdge[];
    clear(): void;
    updateNodeContent(id: string, newContent: string): void;
    private getNeighbors;
    private cosineSimilarity;
    createGraph(chunks: GraphChunk[], embeddings: GraphEmbedding[]): void;
    private selectWeightedNeighbor;
    private randomWalkWithRestart;
    query({ query, topK, randomWalkSteps, restartProb, }: {
        query: number[];
        topK?: number;
        randomWalkSteps?: number;
        restartProb?: number;
    }): RankedNode[];
}
export { GraphRAG }
export { GraphRAG as GraphRAG_alias_1 }

export declare class HTMLHeaderTransformer {
    private headersToSplitOn;
    private returnEachElement;
    constructor(headersToSplitOn: [string, string][], returnEachElement?: boolean);
    splitText({ text }: {
        text: string;
    }): Document[];
    private getXPath;
    private getTextContent;
    private aggregateElementsToChunks;
    createDocuments(texts: string[], metadatas?: Record<string, any>[]): Document[];
    transformDocuments(documents: Document[]): Document[];
}

export declare class HTMLSectionTransformer {
    private headersToSplitOn;
    private options;
    constructor(headersToSplitOn: [string, string][], options?: Record<string, any>);
    splitText(text: string): Document[];
    private getXPath;
    private splitHtmlByHeaders;
    splitDocuments(documents: Document[]): Promise<Document[]>;
    createDocuments(texts: string[], metadatas?: Record<string, any>[]): Document[];
    transformDocuments(documents: Document[]): Document[];
}

declare type KeywordExtractArgs = {
    llm?: any;
    keywords?: number;
    promptTemplate?: string;
};
export { KeywordExtractArgs }
export { KeywordExtractArgs as KeywordExtractArgs_alias_1 }

declare enum Language {
    CPP = "cpp",
    GO = "go",
    JAVA = "java",
    KOTLIN = "kotlin",
    JS = "js",
    TS = "ts",
    PHP = "php",
    PROTO = "proto",
    PYTHON = "python",
    RST = "rst",
    RUBY = "ruby",
    RUST = "rust",
    SCALA = "scala",
    SWIFT = "swift",
    MARKDOWN = "markdown",
    LATEX = "latex",
    HTML = "html",
    SOL = "sol",
    CSHARP = "csharp",
    COBOL = "cobol",
    C = "c",
    LUA = "lua",
    PERL = "perl",
    HASKELL = "haskell",
    ELIXIR = "elixir",
    POWERSHELL = "powershell"
}
export { Language }
export { Language as Language_alias_1 }

export declare class LatexTransformer extends RecursiveCharacterTransformer {
    constructor(options?: {
        size?: number;
        overlap?: number;
        lengthFunction?: (text: string) => number;
        keepSeparator?: boolean | 'start' | 'end';
        addStartIndex?: boolean;
        stripWhitespace?: boolean;
    });
}

declare const LIBSQL_PROMPT = "When querying LibSQL Vector, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n- $all: Match all values in array\n  Example: { \"tags\": { \"$all\": [\"premium\", \"sale\"] } }\n- $elemMatch: Match array elements that meet all specified conditions\n  Example: { \"items\": { \"$elemMatch\": { \"price\": { \"$gt\": 100 } } } }\n- $contains: Check if array contains value\n  Example: { \"tags\": { \"$contains\": \"premium\" } }\n\nLogical Operators:\n- $and: Logical AND (implicit when using multiple conditions)\n  Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n- $not: Logical NOT\n  Example: { \"$not\": { \"category\": \"electronics\" } }\n- $nor: Logical NOR\n  Example: { \"$nor\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nSpecial Operators:\n- $size: Array length check\n  Example: { \"tags\": { \"$size\": 2 } }\n\nRestrictions:\n- Regex patterns are not supported\n- Direct RegExp patterns will throw an error\n- Nested fields are supported using dot notation\n- Multiple conditions on the same field are supported with both implicit and explicit $and\n- Array operations work on array fields only\n- Basic operators handle array values as JSON strings\n- Empty arrays in conditions are handled gracefully\n- Only logical operators ($and, $or, $not, $nor) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n  Invalid: { \"$contains\": \"value\" }\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- $not operator:\n  - Must be an object\n  - Cannot be empty\n  - Can be used at field level or top level\n  - Valid: { \"$not\": { \"field\": \"value\" } }\n  - Valid: { \"field\": { \"$not\": { \"$eq\": \"value\" } } }\n- Other logical operators ($and, $or, $nor):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\n- $elemMatch requires an object with conditions\n  Valid: { \"array\": { \"$elemMatch\": { \"field\": \"value\" } } }\n  Invalid: { \"array\": { \"$elemMatch\": \"value\" } }\n\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gte\": 100, \"$lte\": 1000 } },\n    { \"tags\": { \"$all\": [\"premium\", \"sale\"] } },\n    { \"items\": { \"$elemMatch\": { \"price\": { \"$gt\": 50 }, \"inStock\": true } } },\n    { \"$or\": [\n      { \"stock\": { \"$gt\": 0 } },\n      { \"preorder\": true }\n    ]}\n  ]\n}";
export { LIBSQL_PROMPT }
export { LIBSQL_PROMPT as LIBSQL_PROMPT_alias_1 }

export declare class MarkdownHeaderTransformer {
    private headersToSplitOn;
    private returnEachLine;
    private stripHeaders;
    constructor(headersToSplitOn: [string, string][], returnEachLine?: boolean, stripHeaders?: boolean);
    private aggregateLinesToChunks;
    splitText({ text }: {
        text: string;
    }): Document[];
    createDocuments(texts: string[], metadatas?: Record<string, any>[]): Document[];
    transformDocuments(documents: Document[]): Document[];
}

export declare class MarkdownTransformer extends RecursiveCharacterTransformer {
    constructor(options?: {
        chunkSize?: number;
        chunkOverlap?: number;
        lengthFunction?: (text: string) => number;
        keepSeparator?: boolean | 'start' | 'end';
        addStartIndex?: boolean;
        stripWhitespace?: boolean;
    });
}

declare class MDocument {
    private chunks;
    private type;
    constructor({ docs, type }: {
        docs: {
            text: string;
            metadata?: Record<string, any>;
        }[];
        type: string;
    });
    extractMetadata({ title, summary, questions, keywords }: ExtractParams): Promise<MDocument>;
    static fromText(text: string, metadata?: Record<string, any>): MDocument;
    static fromHTML(html: string, metadata?: Record<string, any>): MDocument;
    static fromMarkdown(markdown: string, metadata?: Record<string, any>): MDocument;
    static fromJSON(jsonString: string, metadata?: Record<string, any>): MDocument;
    private defaultStrategy;
    private chunkBy;
    chunkRecursive(options?: ChunkOptions): Promise<void>;
    chunkCharacter(options?: ChunkOptions): Promise<void>;
    chunkHTML(options?: ChunkOptions): Promise<void>;
    chunkJSON(options?: ChunkOptions): Promise<void>;
    chunkLatex(options?: ChunkOptions): Promise<void>;
    chunkToken(options?: ChunkOptions): Promise<void>;
    chunkMarkdown(options?: ChunkOptions): Promise<void>;
    chunk(params?: ChunkParams): Promise<Document[]>;
    getDocs(): Document[];
    getText(): string[];
    getMetadata(): Record<string, any>[];
}
export { MDocument }
export { MDocument as MDocument_alias_1 }
export { MDocument as MDocument_alias_2 }

declare const PGVECTOR_PROMPT = "When querying PG Vector, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n- $all: Match all values in array\n  Example: { \"tags\": { \"$all\": [\"premium\", \"sale\"] } }\n- $elemMatch: Match array elements that meet all specified conditions\n  Example: { \"items\": { \"$elemMatch\": { \"price\": { \"$gt\": 100 } } } }\n- $contains: Check if array contains value\n  Example: { \"tags\": { \"$contains\": \"premium\" } }\n\nLogical Operators:\n- $and: Logical AND\n  Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n- $not: Logical NOT\n  Example: { \"$not\": { \"category\": \"electronics\" } }\n- $nor: Logical NOR\n  Example: { \"$nor\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nSpecial Operators:\n- $size: Array length check\n  Example: { \"tags\": { \"$size\": 2 } }\n- $regex: Pattern matching (PostgreSQL regex syntax)\n  Example: { \"name\": { \"$regex\": \"^iphone\" } }\n- $options: Regex options (used with $regex)\n  Example: { \"name\": { \"$regex\": \"iphone\", \"$options\": \"i\" } }\n\nRestrictions:\n- Direct RegExp patterns are supported\n- Nested fields are supported using dot notation\n- Multiple conditions on the same field are supported with both implicit and explicit $and\n- Array operations work on array fields only\n- Regex patterns must follow PostgreSQL syntax\n- Empty arrays in conditions are handled gracefully\n- Only logical operators ($and, $or, $not, $nor) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n  Invalid: { \"$regex\": \"pattern\" }\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- $not operator:\n  - Must be an object\n  - Cannot be empty\n  - Can be used at field level or top level\n  - Valid: { \"$not\": { \"field\": \"value\" } }\n  - Valid: { \"field\": { \"$not\": { \"$eq\": \"value\" } } }\n- Other logical operators ($and, $or, $nor):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\n- $elemMatch requires an object with conditions\n  Valid: { \"array\": { \"$elemMatch\": { \"field\": \"value\" } } }\n  Invalid: { \"array\": { \"$elemMatch\": \"value\" } }\n\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gte\": 100, \"$lte\": 1000 } },\n    { \"tags\": { \"$all\": [\"premium\", \"sale\"] } },\n    { \"items\": { \"$elemMatch\": { \"price\": { \"$gt\": 50 }, \"inStock\": true } } },\n    { \"$or\": [\n      { \"name\": { \"$regex\": \"^iphone\", \"$options\": \"i\" } },\n      { \"description\": { \"$regex\": \".*apple.*\" } }\n    ]}\n  ]\n}";
export { PGVECTOR_PROMPT }
export { PGVECTOR_PROMPT as PGVECTOR_PROMPT_alias_1 }

declare const PINECONE_PROMPT = "When querying Pinecone, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n- $all: Match all values in array\n  Example: { \"tags\": { \"$all\": [\"premium\", \"sale\"] } }\n\nLogical Operators:\n- $and: Logical AND (can be implicit or explicit)\n  Implicit Example: { \"price\": { \"$gt\": 100 }, \"category\": \"electronics\" }\n  Explicit Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nRestrictions:\n- Regex patterns are not supported\n- Only $and and $or logical operators are supported at the top level\n- Empty arrays in $in/$nin will return no results\n- A non-empty array is required for $all operator\n- Nested fields are supported using dot notation\n- Multiple conditions on the same field are supported with both implicit and explicit $and\n- At least one key-value pair is required in filter object\n- Empty objects and undefined values are treated as no filter\n- Invalid types in comparison operators will throw errors\n- All non-logical operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- Logical operators ($and, $or):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gte\": 100, \"$lte\": 1000 } },\n    { \"tags\": { \"$all\": [\"premium\", \"sale\"] } },\n    { \"rating\": { \"$exists\": true, \"$gt\": 4 } },\n    { \"$or\": [\n      { \"stock\": { \"$gt\": 0 } },\n      { \"preorder\": true }\n    ]}\n  ]\n}";
export { PINECONE_PROMPT }
export { PINECONE_PROMPT as PINECONE_PROMPT_alias_1 }

declare type PromptTemplate = {
    template: string;
};
export { PromptTemplate }
export { PromptTemplate as PromptTemplate_alias_1 }

declare const QDRANT_PROMPT = "When querying Qdrant, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n\nLogical Operators:\n- $and: Logical AND (implicit when using multiple conditions)\n  Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n- $not: Logical NOT\n  Example: { \"$not\": { \"category\": \"electronics\" } }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nSpecial Operators:\n- $regex: Pattern matching\n  Example: { \"name\": { \"$regex\": \"iphone.*\" } }\n- $count: Array length/value count\n  Example: { \"tags\": { \"$count\": { \"$gt\": 2 } } }\n- $geo: Geographical filters (supports radius, box, polygon)\n  Example: {\n    \"location\": {\n      \"$geo\": {\n        \"type\": \"radius\",\n        \"center\": { \"lat\": 52.5, \"lon\": 13.4 },\n        \"radius\": 10000\n      }\n    }\n  }\n- $hasId: Match specific document IDs\n  Example: { \"$hasId\": [\"doc1\", \"doc2\"] }\n- $hasVector: Check vector existence\n  Example: { \"$hasVector\": \"\" }\n- $datetime: RFC 3339 datetime range\n  Example: {\n    \"created_at\": {\n      \"$datetime\": {\n        \"range\": {\n          \"gt\": \"2024-01-01T00:00:00Z\",\n          \"lt\": \"2024-12-31T23:59:59Z\"\n        }\n      }\n    }\n  }\n- $null: Check for null values\n  Example: { \"field\": { \"$null\": true } }\n- $empty: Check for empty values\n  Example: { \"array\": { \"$empty\": true } }\n- $nested: Nested object filters\n  Example: {\n    \"items[]\": {\n      \"$nested\": {\n        \"price\": { \"$gt\": 100 },\n        \"stock\": { \"$gt\": 0 }\n      }\n    }\n  }\n\nRestrictions:\n- Only logical operators ($and, $or, $not) and collection operators ($hasId, $hasVector) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Valid: { \"$hasId\": [...] }\n  Invalid: { \"$gt\": 100 }\n- Nested fields are supported using dot notation\n- Array fields with nested objects use [] suffix: \"items[]\"\n- Geo filtering requires specific format for radius, box, or polygon\n- Datetime values must be in RFC 3339 format\n- Empty arrays in conditions are handled as empty values\n- Null values are handled with $null operator\n- Empty values are handled with $empty operator\n- $regex uses standard regex syntax\n- $count can only be used with numeric comparison operators\n- $nested requires an object with conditions\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- $not operator:\n  - Must be an object\n  - Cannot be empty\n  - Can be used at field level or top level\n  - Valid: { \"$not\": { \"field\": \"value\" } }\n  - Valid: { \"field\": { \"$not\": { \"$eq\": \"value\" } } }\n- Other logical operators ($and, $or):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\"] } },\n    { \"price\": { \"$gt\": 100 } },\n    { \"location\": {\n      \"$geo\": {\n        \"type\": \"radius\",\n        \"center\": { \"lat\": 52.5, \"lon\": 13.4 },\n        \"radius\": 5000\n      }\n    }},\n    { \"items[]\": {\n      \"$nested\": {\n        \"price\": { \"$gt\": 50 },\n        \"stock\": { \"$gt\": 0 }\n      }\n    }},\n    { \"created_at\": {\n      \"$datetime\": {\n        \"range\": {\n          \"gt\": \"2024-01-01T00:00:00Z\"\n        }\n      }\n    }},\n    { \"$or\": [\n      { \"status\": { \"$ne\": \"discontinued\" } },\n      { \"clearance\": true }\n    ]}\n  ]\n}";
export { QDRANT_PROMPT }
export { QDRANT_PROMPT as QDRANT_PROMPT_alias_1 }

declare const queryTextDescription = "The text query to search for in the vector database.\n- ALWAYS provide a non-empty query string\n- Must contain the user's question or search terms\n- Example: \"market data\" or \"financial reports\"\n- If the user's query is about a specific topic, use that topic as the queryText\n- Cannot be an empty string\n- Do not include quotes, just the text itself\n- Required for all searches";
export { queryTextDescription }
export { queryTextDescription as queryTextDescription_alias_1 }
export { queryTextDescription as queryTextDescription_alias_2 }

declare type QuestionAnswerExtractArgs = {
    llm?: any;
    questions?: number;
    promptTemplate?: string;
    embeddingOnly?: boolean;
};
export { QuestionAnswerExtractArgs }
export { QuestionAnswerExtractArgs as QuestionAnswerExtractArgs_alias_1 }

declare interface RankedNode extends GraphNode {
    score: number;
}

export declare class RecursiveCharacterTransformer extends TextTransformer {
    protected separators: string[];
    protected isSeparatorRegex: boolean;
    constructor({ separators, isSeparatorRegex, options, }: {
        separators?: string[];
        isSeparatorRegex?: boolean;
        options?: ChunkOptions;
    });
    private _splitText;
    splitText({ text }: {
        text: string;
    }): string[];
    static fromLanguage(language: Language, options?: {
        size?: number;
        chunkOverlap?: number;
        lengthFunction?: (text: string) => number;
        keepSeparator?: boolean | 'start' | 'end';
        addStartIndex?: boolean;
        stripWhitespace?: boolean;
    }): RecursiveCharacterTransformer;
    static getSeparatorsForLanguage(language: Language): string[];
}

export declare class RecursiveJsonTransformer {
    private maxSize;
    private minSize;
    constructor({ maxSize, minSize }: {
        maxSize: number;
        minSize?: number;
    });
    private static jsonSize;
    /**
     * Transform JSON data while handling circular references
     */
    transform(data: Record<string, any>): Record<string, any>;
    /**
     * Set a value in a nested dictionary based on the given path
     */
    private static setNestedDict;
    /**
     * Convert lists in the JSON structure to dictionaries with index-based keys
     */
    private listToDictPreprocessing;
    /**
     * Handles primitive values (strings, numbers, etc) by either adding them to the current chunk
     * or creating new chunks if they don't fit
     */
    private handlePrimitiveValue;
    /**
     * Creates a nested dictionary chunk from a value and path
     * e.g., path ['a', 'b'], value 'c' becomes { a: { b: 'c' } }
     */
    private createChunk;
    /**
     * Checks if value is within size limits
     */
    private isWithinSizeLimit;
    /**
     * Splits arrays into chunks based on size limits
     * Handles nested objects by recursing into handleNestedObject
     */
    private handleArray;
    /**
     * Splits objects into chunks based on size limits
     * Handles nested arrays and objects by recursing into handleArray and handleNestedObject
     */
    private handleNestedObject;
    /**
     * Splits long strings into smaller chunks at word boundaries
     * Ensures each chunk is within maxSize limit
     */
    private splitLongString;
    /**
     * Core chunking logic that processes JSON data recursively
     * Handles arrays, objects, and primitive values while maintaining structure
     */
    private jsonSplit;
    /**
     * Splits JSON into a list of JSON chunks
     */
    splitJson({ jsonData, convertLists, }: {
        jsonData: Record<string, any>;
        convertLists?: boolean;
    }): Record<string, any>[];
    /**
     * Converts Unicode characters to their escaped ASCII representation
     * e.g., 'café' becomes 'caf\u00e9'
     */
    private escapeNonAscii;
    /**
     * Splits JSON into a list of JSON formatted strings
     */
    splitText({ jsonData, convertLists, ensureAscii, }: {
        jsonData: Record<string, any>;
        convertLists?: boolean;
        ensureAscii?: boolean;
    }): string[];
    /**
     * Create documents from a list of json objects
     */
    createDocuments({ texts, convertLists, ensureAscii, metadatas, }: {
        texts: string[];
        convertLists?: boolean;
        ensureAscii?: boolean;
        metadatas?: Record<string, any>[];
    }): Document[];
    transformDocuments({ ensureAscii, documents, convertLists, }: {
        ensureAscii?: boolean;
        convertLists?: boolean;
        documents: Document[];
    }): Document[];
}

declare function rerank(results: QueryResult[], query: string, model: MastraLanguageModel, options: RerankerFunctionOptions): Promise<RerankResult[]>;
export { rerank }
export { rerank as rerank_alias_1 }

declare interface RerankConfig {
    options?: RerankerOptions;
    model: MastraLanguageModel;
}
export { RerankConfig }
export { RerankConfig as RerankConfig_alias_1 }

declare interface RerankerFunctionOptions {
    weights?: WeightConfig;
    queryEmbedding?: number[];
    topK?: number;
}
export { RerankerFunctionOptions }
export { RerankerFunctionOptions as RerankerFunctionOptions_alias_1 }

declare interface RerankerOptions {
    weights?: WeightConfig;
    topK?: number;
}
export { RerankerOptions }
export { RerankerOptions as RerankerOptions_alias_1 }

declare interface RerankResult {
    result: QueryResult;
    score: number;
    details: ScoringDetails;
}
export { RerankResult }
export { RerankResult as RerankResult_alias_1 }

declare interface ScoringDetails {
    semantic: number;
    vector: number;
    position: number;
    queryAnalysis?: {
        magnitude: number;
        dominantFeatures: number[];
    };
}

export declare function splitTextOnTokens({ text, tokenizer }: {
    text: string;
    tokenizer: Tokenizer;
}): string[];

declare type SummaryExtractArgs = {
    llm?: any;
    summaries?: string[];
    promptTemplate?: string;
};
export { SummaryExtractArgs }
export { SummaryExtractArgs as SummaryExtractArgs_alias_1 }

/**
 * TODO: GraphRAG Enhancements
 *  - Add support for more edge types (sequential, hierarchical, citation, etc)
 *  - Allow for custom edge types
 *  - Utilize metadata for richer connections
 *  - Improve graph traversal and querying using types
 */
declare type SupportedEdgeType = 'semantic';

export declare abstract class TextTransformer implements Transformer {
    protected size: number;
    protected overlap: number;
    protected lengthFunction: (text: string) => number;
    protected keepSeparator: boolean | 'start' | 'end';
    protected addStartIndex: boolean;
    protected stripWhitespace: boolean;
    constructor({ size, overlap, lengthFunction, keepSeparator, addStartIndex, stripWhitespace, }: ChunkOptions);
    setAddStartIndex(value: boolean): void;
    abstract splitText({ text }: {
        text: string;
    }): string[];
    createDocuments(texts: string[], metadatas?: Record<string, any>[]): Document[];
    splitDocuments(documents: Document[]): Document[];
    transformDocuments(documents: Document[]): Document[];
    protected joinDocs(docs: string[], separator: string): string | null;
    protected mergeSplits(splits: string[], separator: string): string[];
}

declare type TitleExtractorsArgs = {
    llm?: any;
    nodes?: number;
    nodeTemplate?: string;
    combineTemplate?: string;
};
export { TitleExtractorsArgs }
export { TitleExtractorsArgs as TitleExtractorsArgs_alias_1 }

declare interface Tokenizer {
    overlap: number;
    tokensPerChunk: number;
    decode: (tokens: number[]) => string;
    encode: (text: string) => number[];
}

export declare class TokenTransformer extends TextTransformer {
    private tokenizer;
    private allowedSpecial;
    private disallowedSpecial;
    constructor({ encodingName, modelName, allowedSpecial, disallowedSpecial, options, }: {
        encodingName: TiktokenEncoding;
        modelName?: TiktokenModel;
        allowedSpecial?: Set<string> | 'all';
        disallowedSpecial?: Set<string> | 'all';
        options: {
            size?: number;
            overlap?: number;
            lengthFunction?: (text: string) => number;
            keepSeparator?: boolean | 'start' | 'end';
            addStartIndex?: boolean;
            stripWhitespace?: boolean;
        };
    });
    splitText({ text }: {
        text: string;
    }): string[];
    static fromTikToken({ encodingName, modelName, options, }: {
        encodingName?: TiktokenEncoding;
        modelName?: TiktokenModel;
        options?: {
            size?: number;
            overlap?: number;
            allowedSpecial?: Set<string> | 'all';
            disallowedSpecial?: Set<string> | 'all';
        };
    }): TokenTransformer;
}

declare const topKDescription = "Controls how many matching documents to return.\n- ALWAYS provide a value\n- If no value is provided, use the default (10)\n- Must be a valid and positive number\n- Cannot be NaN\n- Uses provided value if specified\n- Default: 10 results (use this if unsure)\n- Higher values (like 20) provide more context\n- Lower values (like 3) focus on best matches\n- Based on query requirements";
export { topKDescription }
export { topKDescription as topKDescription_alias_1 }
export { topKDescription as topKDescription_alias_2 }

export declare interface Transformer {
    transformDocuments(documents: Document[]): Document[];
}

declare const UPSTASH_PROMPT = "When querying Upstash Vector, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" } or { \"category\": { \"$eq\": \"electronics\" } }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n- $all: Matches all values in array\n  Example: { \"tags\": { \"$all\": [\"premium\", \"new\"] } }\n\nLogical Operators:\n- $and: Logical AND (implicit when using multiple conditions)\n  Example: { \"$and\": [{ \"price\": { \"$gt\": 100 } }, { \"category\": \"electronics\" }] }\n- $or: Logical OR\n  Example: { \"$or\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n- $not: Logical NOT\n  Example: { \"$not\": { \"category\": \"electronics\" } }\n- $nor: Logical NOR\n  Example: { \"$nor\": [{ \"price\": { \"$lt\": 50 } }, { \"category\": \"books\" }] }\n\nElement Operators:\n- $exists: Check if field exists\n  Example: { \"rating\": { \"$exists\": true } }\n\nSpecial Operators:\n- $regex: Pattern matching using glob syntax (only as operator, not direct RegExp)\n  Example: { \"name\": { \"$regex\": \"iphone*\" } }\n- $contains: Check if array/string contains value\n  Example: { \"tags\": { \"$contains\": \"premium\" } }\n\nRestrictions:\n- Null/undefined values are not supported in any operator\n- Empty arrays are only supported in $in/$nin operators\n- Direct RegExp patterns are not supported, use $regex with glob syntax\n- Nested fields are supported using dot notation\n- Multiple conditions on same field are combined with AND\n- String values with quotes are automatically escaped\n- Only logical operators ($and, $or, $not, $nor) can be used at the top level\n- All other operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Valid: { \"$and\": [...] }\n  Invalid: { \"$gt\": 100 }\n- $regex uses glob syntax (*, ?) not standard regex patterns\n- $contains works on both arrays and string fields\n- Logical operators must contain field conditions, not direct operators\n  Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  Invalid: { \"$and\": [{ \"$gt\": 100 }] }\n- $not operator:\n  - Must be an object\n  - Cannot be empty\n  - Can be used at field level or top level\n  - Valid: { \"$not\": { \"field\": \"value\" } }\n  - Valid: { \"field\": { \"$not\": { \"$eq\": \"value\" } } }\n- Other logical operators ($and, $or, $nor):\n  - Can only be used at top level or nested within other logical operators\n  - Can not be used on a field level, or be nested inside a field\n  - Can not be used inside an operator\n  - Valid: { \"$and\": [{ \"field\": { \"$gt\": 100 } }] }\n  - Valid: { \"$or\": [{ \"$and\": [{ \"field\": { \"$gt\": 100 } }] }] }\n  - Invalid: { \"field\": { \"$and\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$or\": [{ \"$gt\": 100 }] } }\n  - Invalid: { \"field\": { \"$gt\": { \"$and\": [{...}] } } }\nExample Complex Query:\n{\n  \"$and\": [\n    { \"category\": { \"$in\": [\"electronics\", \"computers\"] } },\n    { \"price\": { \"$gt\": 100, \"$lt\": 1000 } },\n    { \"tags\": { \"$all\": [\"premium\", \"new\"] } },\n    { \"name\": { \"$regex\": \"iphone*\" } },\n    { \"description\": { \"$contains\": \"latest\" } },\n    { \"$or\": [\n      { \"brand\": \"Apple\" },\n      { \"rating\": { \"$gte\": 4.5 } }\n    ]}\n  ]\n}";
export { UPSTASH_PROMPT }
export { UPSTASH_PROMPT as UPSTASH_PROMPT_alias_1 }

declare const VECTORIZE_PROMPT = "When querying Vectorize, you can ONLY use the operators listed below. Any other operators will be rejected.\nImportant: Don't explain how to construct the filter - use the specified operators and fields to search the content and return relevant results.\nIf a user tries to give an explicit operator that is not supported, reject the filter entirely and let them know that the operator is not supported.\n\nBasic Comparison Operators:\n- $eq: Exact match (default when using field: value)\n  Example: { \"category\": \"electronics\" }\n- $ne: Not equal\n  Example: { \"category\": { \"$ne\": \"electronics\" } }\n- $gt: Greater than\n  Example: { \"price\": { \"$gt\": 100 } }\n- $gte: Greater than or equal\n  Example: { \"price\": { \"$gte\": 100 } }\n- $lt: Less than\n  Example: { \"price\": { \"$lt\": 100 } }\n- $lte: Less than or equal\n  Example: { \"price\": { \"$lte\": 100 } }\n\nArray Operators:\n- $in: Match any value in array\n  Example: { \"category\": { \"$in\": [\"electronics\", \"books\"] } }\n- $nin: Does not match any value in array\n  Example: { \"category\": { \"$nin\": [\"electronics\", \"books\"] } }\n\nRestrictions:\n- Regex patterns are not supported\n- Logical operators are not supported\n- Element operators are not supported\n- Fields must have a flat structure, as nested fields are not supported\n- Multiple conditions on the same field are supported\n- Empty arrays in $in/$nin will return no results\n- Filter keys cannot be longer than 512 characters\n- Filter keys cannot contain invalid characters ($, \", empty)\n- Filter size is limited to prevent oversized queries\n- Invalid types in operators return no results instead of throwing errors\n- Empty objects are accepted in filters\n- Metadata must use flat structure with dot notation (no nested objects)\n- Must explicitly create metadata indexes for filterable fields (limit 10 per index)\n- Can only effectively filter on indexed metadata fields\n- Metadata values can be strings, numbers, booleans, or homogeneous arrays\n- No operators can be used at the top level (no logical operators supported)\n- All operators must be used within a field condition\n  Valid: { \"field\": { \"$gt\": 100 } }\n  Invalid: { \"$gt\": 100 }\n  Invalid: { \"$in\": [...] }\n\nExample Complex Query:\n{\n  \"category\": { \"$in\": [\"electronics\", \"computers\"] },\n  \"price\": { \"$gte\": 100, \"$lte\": 1000 },\n  \"inStock\": true\n}";
export { VECTORIZE_PROMPT }
export { VECTORIZE_PROMPT as VECTORIZE_PROMPT_alias_1 }

declare const vectorQuerySearch: ({ indexName, vectorStore, queryText, model, queryFilter, topK, includeVectors, maxRetries, }: VectorQuerySearchParams) => Promise<VectorQuerySearchResult>;
export { vectorQuerySearch }
export { vectorQuerySearch as vectorQuerySearch_alias_1 }

declare interface VectorQuerySearchParams {
    indexName: string;
    vectorStore: MastraVector;
    queryText: string;
    model: EmbeddingModel<string>;
    queryFilter?: VectorFilter;
    topK: number;
    includeVectors?: boolean;
    maxRetries?: number;
}

declare interface VectorQuerySearchResult {
    results: QueryResult[];
    queryEmbedding: number[];
}

declare type WeightConfig = {
    semantic?: number;
    vector?: number;
    position?: number;
};

export { }
