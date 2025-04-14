import type { VectorFilter } from '../filter';
import { MastraVector } from '../vector';
import type {
  CreateIndexParams,
  IndexStats,
  QueryVectorParams,
  QueryResult,
  UpsertVectorParams,
  ParamsToArgs,
  QueryVectorArgs,
  CreateIndexArgs,
  UpsertVectorArgs,
} from '../types';

import { MemoryFilterTranslator, evaluateFilter } from './filter';

/**
 * In-memory vector store implementation 
 * Stores vectors and metadata in JavaScript Maps for each index
 */
export class MemoryVector extends MastraVector {
  private indexes: Map<string, {
    dimension: number;
    metric: 'cosine' | 'euclidean' | 'dotproduct';
    vectors: Map<string, { 
      id: string;
      vector: number[];
      metadata: Record<string, any>;
    }>;
  }> = new Map();
  
  constructor() {
    super();
  }

  /**
   * Transform a filter using the memory-specific filter translator
   */
  transformFilter(filter?: VectorFilter) {
    const translator = new MemoryFilterTranslator();
    return translator.translate(filter);
  }
  
  /**
   * Query for vectors by similarity and optional filters
   */
  async query(...args: ParamsToArgs<QueryVectorParams> | QueryVectorArgs): Promise<QueryResult[]> {
    const params = this.normalizeArgs<QueryVectorParams, QueryVectorArgs>('query', args);
    const { indexName, queryVector, topK = 10, filter, includeVector = false } = params;
    
    // Check if index exists
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    // Check vector dimension
    if (queryVector.length !== index.dimension) {
      throw new Error(`Query vector dimension (${queryVector.length}) does not match index dimension (${index.dimension})`);
    }
    
    // Compute similarity for all vectors in the index
    const translatedFilter = this.transformFilter(filter);
    const results: QueryResult[] = [];
    
    for (const { id, vector, metadata } of index.vectors.values()) {
      // Check if metadata matches the filter
      if (translatedFilter && !evaluateFilter(metadata, translatedFilter)) {
        continue;
      }
      
      // Calculate similarity score based on the specified metric
      const score = this.calculateSimilarity(queryVector, vector, index.metric);
      
      results.push({
        id,
        score,
        metadata,
        ...(includeVector && { vector }),
      });
    }
    
    // Sort by score and limit to topK
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
  
  /**
   * Calculate vector similarity based on different distance metrics
   */
  private calculateSimilarity(a: number[], b: number[], metric: 'cosine' | 'euclidean' | 'dotproduct'): number {
    if (metric === 'cosine') {
      // Cosine similarity
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      
      for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      
      if (normA === 0 || normB === 0) return 0;
      return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    } 
    else if (metric === 'euclidean') {
      // Euclidean similarity (1 / (1 + distance))
      let squaredDistance = 0;
      
      for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        squaredDistance += diff * diff;
      }
      
      const distance = Math.sqrt(squaredDistance);
      return 1 / (1 + distance);
    } 
    else if (metric === 'dotproduct') {
      // Dot product (inner product)
      let dotProduct = 0;
      
      for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
      }
      
      return dotProduct;
    }
    
    throw new Error(`Unsupported metric: ${metric}`);
  }

  /**
   * Add or update vectors in an index
   */
  async upsert(...args: ParamsToArgs<UpsertVectorParams> | UpsertVectorArgs): Promise<string[]> {
    const params = this.normalizeArgs<UpsertVectorParams>('upsert', args);
    const { indexName, vectors, metadata = [], ids } = params;
    
    // Check if index exists
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    // Generate or use provided IDs
    const vectorIds = ids || vectors.map(() => crypto.randomUUID());
    
    // Check vector dimensions
    for (const vector of vectors) {
      if (vector.length !== index.dimension) {
        throw new Error(
          `Vector dimension mismatch: Index "${indexName}" expects ${index.dimension} dimensions but got ${vector.length} dimensions. ` +
          `Either use a matching embedding model or delete and recreate the index with the new dimension.`
        );
      }
    }
    
    // Insert or update vectors
    for (let i = 0; i < vectors.length; i++) {
      index.vectors.set(vectorIds[i], {
        id: vectorIds[i],
        vector: vectors[i],
        metadata: metadata[i] || {},
      });
    }
    
    return vectorIds;
  }

  /**
   * Create a new vector index
   */
  async createIndex(...args: ParamsToArgs<CreateIndexParams> | CreateIndexArgs): Promise<void> {
    const params = this.normalizeArgs<CreateIndexParams>('createIndex', args);
    const { indexName, dimension, metric = 'cosine' } = params;
    
    // Validate inputs
    if (!indexName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      throw new Error('Invalid index name format');
    }
    
    if (!Number.isInteger(dimension) || dimension <= 0) {
      throw new Error('Dimension must be a positive integer');
    }
    
    // Create the index
    this.indexes.set(indexName, {
      dimension,
      metric,
      vectors: new Map(),
    });
  }

  /**
   * Delete an index
   */
  async deleteIndex(indexName: string): Promise<void> {
    if (!this.indexes.has(indexName)) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    this.indexes.delete(indexName);
  }

  /**
   * List all available indexes
   */
  async listIndexes(): Promise<string[]> {
    return Array.from(this.indexes.keys());
  }

  /**
   * Get statistics about an index
   */
  async describeIndex(indexName: string): Promise<IndexStats> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    return {
      dimension: index.dimension,
      count: index.vectors.size,
      metric: index.metric,
    };
  }

  /**
   * Update a specific vector by ID
   */
  async updateIndexById(
    indexName: string,
    id: string,
    update: { vector?: number[]; metadata?: Record<string, any> },
  ): Promise<void> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    const entry = index.vectors.get(id);
    if (!entry) {
      throw new Error(`Vector with ID ${id} not found in index ${indexName}`);
    }
    
    if (update.vector) {
      if (update.vector.length !== index.dimension) {
        throw new Error(
          `Vector dimension mismatch: Index "${indexName}" expects ${index.dimension} dimensions but got ${update.vector.length} dimensions`
        );
      }
      entry.vector = update.vector;
    }
    
    if (update.metadata) {
      entry.metadata = {
        ...entry.metadata,
        ...update.metadata,
      };
    }
    
    // Update the entry
    index.vectors.set(id, entry);
  }

  /**
   * Delete a specific vector by ID
   */
  async deleteIndexById(indexName: string, id: string): Promise<void> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    if (!index.vectors.has(id)) {
      throw new Error(`Vector with ID ${id} not found in index ${indexName}`);
    }
    
    index.vectors.delete(id);
  }

  /**
   * Remove all vectors from an index but keep the index
   */
  async truncateIndex(indexName: string): Promise<void> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} does not exist`);
    }
    
    index.vectors.clear();
  }
}

// Export as DefaultVectorDB for consistency with other implementations
export { MemoryVector as DefaultVectorDB };