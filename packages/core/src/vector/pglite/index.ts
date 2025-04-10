import { join, resolve, isAbsolute } from 'path';
import { PGlite } from '@electric-sql/pglite';
// import { MemoryFS } from '@electric-sql/pglite';
// import { vector } from '@electric-sql/pglite/vector';

import type { VectorFilter } from '../filter';
import { MastraVector } from '../index';
import type {
  CreateIndexParams,
  IndexStats,
  QueryVectorParams,
  QueryResult,
  UpsertVectorParams,
  ParamsToArgs,
  QueryVectorArgs,
} from '../index';

import { PGliteFilterTranslator } from './filter';
import { buildFilterQuery } from './sql-builder';

interface PGliteQueryParams extends QueryVectorParams {
  minScore?: number;
}

type PGliteQueryArgs = [...QueryVectorArgs, number?];

export class PGliteVector extends MastraVector {
  private client: PGlite;
  private clientPromise: Promise<PGlite>;

  constructor({
    client,
  }: {
    client: PGlite;
  }) {
    super();

    this.client = client;
    this.clientPromise = Promise.resolve(client);
  }

  private async getClient(): Promise<PGlite> {
    if (!this.client && this.clientPromise) {
      this.client = await this.clientPromise;
    }
    if (!this.client) {
      throw new Error('PGlite client not initialized');
    }
    return this.client;
  }

  transformFilter(filter?: VectorFilter) {
    const translator = new PGliteFilterTranslator();
    return translator.translate(filter);
  }

  async query(...args: ParamsToArgs<PGliteQueryParams> | PGliteQueryArgs): Promise<QueryResult[]> {
    const params = this.normalizeArgs<PGliteQueryParams, PGliteQueryArgs>('query', args, ['minScore']);

    try {
      const { indexName, queryVector, topK = 10, filter, includeVector = false, minScore = 0 } = params;
      const client = await this.getClient();

      // Convert JavaScript array to vector literal
      const vectorLiteral = `[${queryVector.join(',')}]`;

      const translatedFilter = this.transformFilter(filter);
      const { sql: filterQuery, values: filterValues } = buildFilterQuery(translatedFilter);
      
      // Start parameter index where filter values left off
      const scoreParamIndex = filterValues.length + 1;
      const queryParams = [...filterValues, minScore];

      const query = `
        WITH vector_scores AS (
          SELECT
            vector_id as id,
            1 - (embedding <=> '${vectorLiteral}'::vector) as score,
            metadata
            ${includeVector ? ', embedding::float4[] as vector' : ''}
          FROM ${indexName}
          ${filterQuery}
        )
        SELECT *
        FROM vector_scores
        WHERE score > $${scoreParamIndex}
        ORDER BY score DESC
        LIMIT ${topK}`;

      const result = await client.query(query, queryParams);

      return (result.rows || []).map((row: any) => {
        const { id, score, metadata, vector } = row;
        return {
          id: id as string,
          score: score as number,
          metadata: typeof metadata === 'string' ? JSON.parse(metadata) : metadata,
          ...(includeVector && vector && { vector: vector as number[] }),
        };
      });
    } catch (error) {
      this.logger.error(`Error querying vectors: ${error}`);
      throw error;
    }
  }

  async upsert(...args: ParamsToArgs<UpsertVectorParams>): Promise<string[]> {
    const params = this.normalizeArgs<UpsertVectorParams>('upsert', args);
    const { indexName, vectors, metadata, ids } = params;
    const client = await this.getClient();

    try {
      const vectorIds = ids || vectors.map(() => crypto.randomUUID());
      
      await client.transaction(async (tx) => {
        for (let i = 0; i < vectors.length; i++) {
          // Use non-null assertion as we know vectors[i] exists within the bounds of the loop
          const vectorLiteral = `[${vectors[i]!.join(',')}]`;
          const metadataJson = JSON.stringify(metadata?.[i] || {});
          
          await tx.query(
            `INSERT INTO ${indexName} (vector_id, embedding, metadata)
            VALUES ($1, $2::vector, $3::jsonb)
            ON CONFLICT(vector_id) DO UPDATE SET
              embedding = $2::vector,
              metadata = $3::jsonb`,
            [vectorIds[i]!, vectorLiteral, metadataJson]
          );
        }
      });

      return vectorIds;
    } catch (error) {
      this.logger.error(`Error upserting vectors: ${error}`);
      throw error;
    }
  }

  async createIndex(...args: ParamsToArgs<CreateIndexParams>): Promise<void> {
    const params = this.normalizeArgs<CreateIndexParams>('createIndex', args);

    const { indexName, dimension, metric = 'cosine' } = params;
    try {
      // Validate inputs
      if (!indexName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        throw new Error('Invalid index name format');
      }
      if (!Number.isInteger(dimension) || dimension <= 0) {
        throw new Error('Dimension must be a positive integer');
      }

      const client = await this.getClient();

      // Create the table using the pgvector extension
      // PG syntax: vector(dimension) vs SQLite syntax: F32_BLOB(dimension)
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${indexName} (
          id SERIAL PRIMARY KEY,
          vector_id TEXT UNIQUE NOT NULL,
          embedding vector(${dimension}) NOT NULL,
          metadata JSONB DEFAULT '{}'::jsonb
        )
      `);

      // Create an appropriate index based on the metric
      // The index operators differ by distance metric
      let operator = '';
      switch (metric) {
        case 'cosine':
          operator = 'vector_cosine_ops';
          break;
        case 'euclidean':
          operator = 'vector_l2_ops';
          break;
        case 'dotproduct':
          operator = 'vector_ip_ops';
          break;
        default:
          operator = 'vector_cosine_ops'; // Default to cosine
      }

      // Create a vector index using HNSW (recommended for performance)
      await client.query(`
        CREATE INDEX IF NOT EXISTS ${indexName}_vector_idx
        ON ${indexName} USING hnsw (embedding ${operator})
      `);
    } catch (error) {
      this.logger.error(`Failed to create vector table: ${error}`);
      throw error;
    }
  }

  async deleteIndex(indexName: string): Promise<void> {
    try {
      const client = await this.getClient();
      await client.query(`DROP TABLE IF EXISTS ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to delete vector table: ${error}`);
      throw error;
    }
  }

  async listIndexes(): Promise<string[]> {
    try {
      const client = await this.getClient();
      const vectorTablesQuery = `
        SELECT tablename FROM pg_tables 
        WHERE tablename IN (
          SELECT table_name 
          FROM information_schema.columns 
          WHERE data_type = 'USER-DEFINED' AND udt_name = 'vector'
        )
      `;
      const result = await client.query(vectorTablesQuery);
      return (result.rows || []).map((row: any) => row.tablename as string);
    } catch (error) {
      this.logger.error(`Failed to list vector tables: ${error}`);
      throw error;
    }
  }

  async describeIndex(indexName: string): Promise<IndexStats> {
    try {
      const client = await this.getClient();
      
      // Get dimension from table schema
      const dimensionQuery = `
        SELECT a.atttypmod as dimension
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        WHERE c.relname = $1 AND a.attname = 'embedding'
      `;
      const dimensionResult = await client.query(dimensionQuery, [indexName]);
      const dimensionRow = dimensionResult.rows?.[0] as any;
      const dimension = dimensionRow?.dimension || 0;

      // Get row count
      const countQuery = `SELECT COUNT(*) as count FROM ${indexName}`;
      const countResult = await client.query(countQuery);
      const countRow = countResult.rows?.[0] as any;
      const count = countRow?.count || 0;

      // Get metric type from index
      const metricQuery = `
        SELECT amname, opcname
        FROM pg_index i
        JOIN pg_class c ON i.indexrelid = c.oid
        JOIN pg_opclass op ON i.indclass[0] = op.oid
        JOIN pg_am am ON op.opcmethod = am.oid
        WHERE c.relname LIKE $1 || '%'
      `;
      const metricResult = await client.query(metricQuery, [indexName]);
      
      let metric: 'cosine' | 'euclidean' | 'dotproduct' = 'cosine';
      if (metricResult.rows?.length > 0) {
        const row = metricResult.rows[0] as any;
        const opcname = row?.opcname as string;
        if (opcname?.includes('l2')) {
          metric = 'euclidean';
        } else if (opcname?.includes('ip')) {
          metric = 'dotproduct';
        }
        // Default is already 'cosine'
      }

      return {
        dimension,
        count: parseInt(count as string, 10),
        metric,
      };
    } catch (error) {
      this.logger.error(`Failed to describe vector table: ${error}`);
      throw error;
    }
  }

  async updateIndexById(
    indexName: string,
    id: string,
    update: { vector?: number[]; metadata?: Record<string, any> },
  ): Promise<void> {
    try {
      const client = await this.getClient();
      const updates = [];
      const values = [id];
      let paramIndex = 2;

      if (update.vector) {
        const vectorLiteral = `[${update.vector.join(',')}]`;
        updates.push(`embedding = $${paramIndex}::vector`);
        values.push(vectorLiteral);
        paramIndex++;
      }

      if (update.metadata) {
        updates.push(`metadata = $${paramIndex}::jsonb`);
        values.push(JSON.stringify(update.metadata));
        paramIndex++;
      }

      if (updates.length === 0) {
        throw new Error('No updates provided');
      }

      const query = `
        UPDATE ${indexName}
        SET ${updates.join(', ')}
        WHERE vector_id = $1
      `;

      await client.query(query, values);
    } catch (error) {
      this.logger.error(`Failed to update index by id: ${id} for index: ${indexName}: ${error}`);
      throw error;
    }
  }

  async deleteIndexById(indexName: string, id: string): Promise<void> {
    try {
      const client = await this.getClient();
      await client.query(`DELETE FROM ${indexName} WHERE vector_id = $1`, [id]);
    } catch (error) {
      this.logger.error(`Failed to delete index by id: ${id} for index: ${indexName}: ${error}`);
      throw error;
    }
  }

  async truncateIndex(indexName: string) {
    try {
      const client = await this.getClient();
      await client.query(`DELETE FROM ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to truncate index: ${indexName}: ${error}`);
      throw error;
    }
  }
}

export { PGliteVector as DefaultVectorDB };
