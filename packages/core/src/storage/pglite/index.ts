import { join, resolve, isAbsolute } from 'path';
import { PGlite } from '@electric-sql/pglite';
import { MemoryFS } from '@electric-sql/pglite';

import type { MetricResult, TestInfo } from '../../eval';
import type { MessageType, StorageThreadType } from '../../memory/types';
import { MastraStorage } from '../base';
import { TABLE_EVALS, TABLE_MESSAGES, TABLE_THREADS, TABLE_TRACES, TABLE_WORKFLOW_SNAPSHOT } from '../constants';
import type { TABLE_NAMES } from '../constants';
import type { StorageColumn, StorageGetMessagesArg, EvalRow } from '../types';

function safelyParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

export interface PGliteConfig {
  url: string;
  authToken?: string;
}

interface ThreadRow {
  id: string;
  resourceId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  metadata: string | Record<string, unknown>;
}

interface TraceRow {
  id: string;
  parentSpanId: string;
  traceId: string;
  name: string;
  scope: string;
  kind: string;
  status: string;
  events: string;
  links: string;
  attributes: string;
  startTime: string | number;  // Could be stored as number (bigint)
  endTime: string | number;  // Could be stored as number (bigint)
  other: string;
  createdAt: string;
}

export class PGliteStore extends MastraStorage {
  private client: PGlite | null = null;
  private clientPromise: Promise<PGlite> | null = null;

  constructor({ config }: { config: PGliteConfig }) {
    super({ name: `PGliteStore` });

    // need to re-init every time for in memory dbs or the tables might not exist
    if (config.url === ':memory:' || config.url.startsWith('file::memory:')) {
      this.shouldCacheInit = false;
    }

    this.clientPromise = this.initClient(config);
  }

  private async initClient(config: PGliteConfig): Promise<PGlite> {
    const url = this.rewriteDbUrl(config.url);
    this.logger.debug(`Initializing PGlite with URL: ${url}`);
    
    try {
      // interface PGliteOptions<TExtensions extends Extensions = Extensions> {
      //   dataDir?: string;
      //   username?: string;
      //   database?: string;
      //   fs?: Filesystem;
      //   debug?: DebugLevel;
      //   relaxedDurability?: boolean;
      //   extensions?: TExtensions;
      //   loadDataDir?: Blob | File;
      //   initialMemory?: number;
      //   wasmModule?: WebAssembly.Module;
      //   fsBundle?: Blob | File;
      //   parsers?: ParserOptions;
      //   serializers?: SerializerOptions;
      // }
      const client = await PGlite.create(url, {
        fs: new MemoryFS(),
      });
      this.client = client;
      return client;
    } catch (error) {
      this.logger.error(`Error initializing PGlite client: ${error}`);
      throw error;
    }
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

  // Rewrite DB URL to match the LibSQLStore logic for consistent file paths
  protected rewriteDbUrl(url: string): string {
    if (url.startsWith('file:') && url !== 'file::memory:') {
      const pathPart = url.slice('file:'.length);

      if (isAbsolute(pathPart)) {
        return url;
      }

      const cwd = process.cwd();

      if (cwd.includes('.mastra') && (cwd.endsWith(`output`) || cwd.endsWith(`output/`) || cwd.endsWith(`output\\`))) {
        const baseDir = join(cwd, `..`, `..`); // <- .mastra/output/../../

        const fullPath = resolve(baseDir, pathPart);

        this.logger.debug(
          `Initializing PGlite db with url ${url} with relative file path from inside .mastra/output directory. Rewriting relative file url to "file:${fullPath}". This ensures it's outside the .mastra/output directory.`,
        );

        return `file:${fullPath}`;
      }
    }

    return url;
  }

  private getCreateTableSQL(tableName: TABLE_NAMES, schema: Record<string, StorageColumn>): string {
    const columns = Object.entries(schema).map(([name, col]) => {
      let type = col.type.toUpperCase();
      if (type === 'TEXT') type = 'TEXT';
      if (type === 'TIMESTAMP') type = 'TEXT'; // Store timestamps as ISO strings
      // Match LibSQL type handling
      if (type === 'JSONB') type = 'JSONB';
      if (type === 'BIGINT') type = 'BIGINT';
      if (type === 'INTEGER') type = 'INTEGER';

      const nullable = col.nullable ? '' : 'NOT NULL';
      const primaryKey = col.primaryKey ? 'PRIMARY KEY' : '';

      return `"${name}" ${type} ${nullable} ${primaryKey}`.trim();
    });

    // For workflow_snapshot table, create a composite primary key
    if (tableName === TABLE_WORKFLOW_SNAPSHOT) {
      const stmnt = `CREATE TABLE IF NOT EXISTS ${tableName} (
                ${columns.join(',\n')},
                PRIMARY KEY (workflow_name, run_id)
            )`;
      return stmnt;
    }

    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')})`;
  }

  async createTable({
    tableName,
    schema,
  }: {
    tableName: TABLE_NAMES;
    schema: Record<string, StorageColumn>;
  }): Promise<void> {
    try {
      this.logger.debug(`Creating database table`, { tableName, operation: 'schema init' });
      const sql = this.getCreateTableSQL(tableName, schema);
      const client = await this.getClient();
      await client.exec(sql);
    } catch (error) {
      this.logger.error(`Error creating table ${tableName}: ${error}`);
      throw error;
    }
  }

  async clearTable({ tableName }: { tableName: TABLE_NAMES }): Promise<void> {
    try {
      const client = await this.getClient();
      await client.exec(`DELETE FROM ${tableName}`);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e.message);
      }
    }
  }

  private prepareParams(record: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(record).map(([k, v]) => {
        if (typeof v === `undefined`) {
          // Return null for undefined values
          return [k, null];
        }
        if (v instanceof Date) {
          return [k, v.toISOString()];
        }
        if (typeof v === 'object') {
          return [k, JSON.stringify(v)];
        }
        return [k, v];
      })
    );
  }

  async insert({ tableName, record }: { tableName: TABLE_NAMES; record: Record<string, any> }): Promise<void> {
    try {
      const client = await this.getClient();
      const columns = Object.keys(record);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const params = this.prepareParams(record);
      const values = Object.values(params);

      // Quote all column names to preserve case
      const quotedColumns = columns.map(col => `"${col}"`);
      
      await client.query(
        `INSERT INTO ${tableName} (${quotedColumns.join(', ')}) VALUES (${placeholders}) 
         ON CONFLICT (${this.getPrimaryKeys(tableName)}) DO UPDATE SET 
         ${columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ')}`,
        values
      );
    } catch (error) {
      this.logger.error(`Error upserting into table ${tableName}: ${error}`);
      throw error;
    }
  }

  // Helper to get primary keys for upsert operation
  private getPrimaryKeys(tableName: TABLE_NAMES): string {
    switch (tableName) {
      case TABLE_THREADS:
      case TABLE_MESSAGES:
      case TABLE_TRACES:
        return '"id"';
      case TABLE_WORKFLOW_SNAPSHOT:
        return '"workflow_name", "run_id"';
      default:
        return '"id"'; // Default to 'id' for other tables
    }
  }

  async batchInsert({ tableName, records }: { tableName: TABLE_NAMES; records: Record<string, any>[] }): Promise<void> {
    if (records.length === 0) return;

    try {
      const client = await this.getClient();
      
      // Use a transaction for the batch insert
      await client.transaction(async (tx) => {
        for (const record of records) {
          const columns = Object.keys(record);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const params = this.prepareParams(record);
          const values = Object.values(params);
          
          // Quote all column names to preserve case
          const quotedColumns = columns.map(col => `"${col}"`);

          await tx.query(
            `INSERT INTO ${tableName} (${quotedColumns.join(', ')}) VALUES (${placeholders}) 
             ON CONFLICT (${this.getPrimaryKeys(tableName)}) DO UPDATE SET 
             ${columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ')}`,
            values
          );
        }
      });
    } catch (error) {
      this.logger.error(`Error batch upserting into table ${tableName}: ${error}`);
      throw error;
    }
  }

  async load<R>({ tableName, keys }: { tableName: TABLE_NAMES; keys: Record<string, string> }): Promise<R | null> {
    const conditions = Object.keys(keys).map((key, i) => `"${key}" = $${i + 1}`).join(' AND ');
    const values = Object.values(keys);

    const client = await this.getClient();
    try {
      const result = await client.query(
        `SELECT * FROM ${tableName} WHERE ${conditions} ORDER BY "createdAt" DESC LIMIT 1`,
        values
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      // Parse JSON strings in the result
      const parsed = Object.fromEntries(
        Object.entries(row || {}).map(([k, v]) => {
          try {
            return [k, typeof v === 'string' ? (v.startsWith('{') || v.startsWith('[') ? JSON.parse(v) : v) : v];
          } catch {
            return [k, v];
          }
        }),
      );

      return parsed as R;
    } catch (error) {
      this.logger.error(`Error querying table ${tableName}: ${error}`);
      throw error;
    }
  }

  async getThreadById({ threadId }: { threadId: string }): Promise<StorageThreadType | null> {
    const result = await this.load<ThreadRow>({
      tableName: TABLE_THREADS,
      keys: { id: threadId },
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      createdAt: typeof result.createdAt === 'string' ? new Date(result.createdAt) : result.createdAt,
      updatedAt: typeof result.updatedAt === 'string' ? new Date(result.updatedAt) : result.updatedAt,
      metadata: typeof result.metadata === 'string' ? JSON.parse(result.metadata) : result.metadata,
    } as StorageThreadType;
  }

  async getThreadsByResourceId({ resourceId }: { resourceId: string }): Promise<StorageThreadType[]> {
    const client = await this.getClient();
    const result = await client.query<ThreadRow>(
      `SELECT * FROM ${TABLE_THREADS} WHERE "resourceId" = $1`,
      [resourceId]
    );

    return (result.rows ?? []).map(thread => ({
      id: thread.id,
      resourceId: thread.resourceId,
      title: thread.title,
      createdAt: typeof thread.createdAt === 'string' ? new Date(thread.createdAt) : thread.createdAt,
      updatedAt: typeof thread.updatedAt === 'string' ? new Date(thread.updatedAt) : thread.updatedAt,
      metadata: typeof thread.metadata === 'string' ? JSON.parse(thread.metadata) : thread.metadata,
    })) as StorageThreadType[];
  }

  async saveThread({ thread }: { thread: StorageThreadType }): Promise<StorageThreadType> {
    await this.insert({
      tableName: TABLE_THREADS,
      record: {
        ...thread,
        metadata: JSON.stringify(thread.metadata),
      },
    });

    return thread;
  }

  async updateThread({
    id,
    title,
    metadata,
  }: {
    id: string;
    title: string;
    metadata: Record<string, unknown>;
  }): Promise<StorageThreadType> {
    const thread = await this.getThreadById({ threadId: id });
    if (!thread) {
      throw new Error(`Thread ${id} not found`);
    }

    const updatedThread = {
      ...thread,
      title,
      metadata: {
        ...thread.metadata,
        ...metadata,
      },
    };

    const client = await this.getClient();
    await client.query(
      `UPDATE ${TABLE_THREADS} SET title = $1, metadata = $2 WHERE id = $3`,
      [title, JSON.stringify(updatedThread.metadata), id]
    );

    return updatedThread;
  }

  async deleteThread({ threadId }: { threadId: string }): Promise<void> {
    const client = await this.getClient();
    await client.query(
      `DELETE FROM ${TABLE_THREADS} WHERE id = $1`,
      [threadId]
    );
    // Messages will need to be deleted separately since PGlite might not support CASCADE
    await client.query(
      `DELETE FROM ${TABLE_MESSAGES} WHERE thread_id = $1`,
      [threadId]
    );
  }

  private parseRow(row: any): MessageType {
    let content = row.content;
    try {
      content = JSON.parse(row.content);
    } catch {
      // use content as is if it's not JSON
    }
    return {
      id: row.id,
      content,
      role: row.role,
      type: row.type,
      createdAt: new Date(row.createdAt as string),
      threadId: row.thread_id,
    } as MessageType;
  }

  async getMessages<T extends MessageType[]>({ threadId, selectBy }: StorageGetMessagesArg): Promise<T> {
    try {
      const client = await this.getClient();
      const messages: MessageType[] = [];
      const limit = typeof selectBy?.last === `number` ? selectBy.last : 40;

      // If we have specific messages to select
      if (selectBy?.include?.length) {
        const includeIds = selectBy.include.map(i => i.id);
        const maxPrev = Math.max(...selectBy.include.map(i => i.withPreviousMessages || 0));
        const maxNext = Math.max(...selectBy.include.map(i => i.withNextMessages || 0));

        // Get messages around all specified IDs using a window function
        const includeResult = await client.query(
          `
          WITH numbered_messages AS (
            SELECT 
              id,
              content,
              role,
              type,
              "createdAt",
              thread_id,
              ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) as row_num
            FROM "${TABLE_MESSAGES}"
            WHERE thread_id = $1
          ),
          target_positions AS (
            SELECT row_num as target_pos
            FROM numbered_messages
            WHERE id IN (${includeIds.map((_, i) => `$${i + 2}`).join(', ')})
          )
          SELECT DISTINCT m.*
          FROM numbered_messages m
          CROSS JOIN target_positions t
          WHERE m.row_num BETWEEN (t.target_pos - $${includeIds.length + 2}) AND (t.target_pos + $${includeIds.length + 3})
          ORDER BY m."createdAt" ASC
          `,
          [threadId, ...includeIds, maxPrev, maxNext]
        );

        if (includeResult.rows && includeResult.rows.length > 0) {
          messages.push(...includeResult.rows.map((row: any) => this.parseRow(row)));
        }
      }

      // Get remaining messages, excluding already fetched IDs
      const excludeIds = messages.map(m => m.id);
      
      let remainingSql;
      let remainingArgs;
      
      if (excludeIds.length) {
        remainingSql = `
          SELECT 
            id, 
            content, 
            role, 
            type,
            "createdAt", 
            thread_id
          FROM "${TABLE_MESSAGES}"
          WHERE thread_id = $1
          AND id NOT IN (${excludeIds.map((_, i) => `$${i + 2}`).join(', ')})
          ORDER BY "createdAt" DESC
          LIMIT $${excludeIds.length + 2}
        `;
        remainingArgs = [threadId, ...excludeIds, limit];
      } else {
        remainingSql = `
          SELECT 
            id, 
            content, 
            role, 
            type,
            "createdAt", 
            thread_id
          FROM "${TABLE_MESSAGES}"
          WHERE thread_id = $1
          ORDER BY "createdAt" DESC
          LIMIT $2
        `;
        remainingArgs = [threadId, limit];
      }

      const remainingResult = await client.query(remainingSql, remainingArgs);
      
      if (remainingResult.rows && remainingResult.rows.length > 0) {
        messages.push(...remainingResult.rows.map((row: any) => this.parseRow(row)));
      }

      // Sort all messages by creation date
      messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      return messages as T;
    } catch (error) {
      this.logger.error('Error getting messages:', error as Error);
      throw error;
    }
  }

  async saveMessages({ messages }: { messages: MessageType[] }): Promise<MessageType[]> {
    if (messages.length === 0) return messages;

    const client = await this.getClient();
    try {
      const threadId = messages[0]?.threadId;
      if (!threadId) {
        throw new Error('Thread ID is required');
      }

      await client.transaction(async (tx) => {
        for (const message of messages) {
          const time = message.createdAt || new Date();
          await tx.query(
            `INSERT INTO ${TABLE_MESSAGES} (id, thread_id, content, role, type, "createdAt") 
              VALUES ($1, $2, $3, $4, $5, $6)
              ON CONFLICT (id) DO UPDATE SET
              content = $3, role = $4, type = $5, "createdAt" = $6`,
            [
              message.id,
              threadId,
              typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
              message.role,
              message.type,
              time instanceof Date ? time.toISOString() : time,
            ]
          );
        }
      });

      return messages;
    } catch (error) {
      this.logger.error('Failed to save messages in database: ' + (error as any)?.message);
      throw error;
    }
  }

  private transformEvalRow(row: Record<string, any>): EvalRow {
    const resultValue = typeof row.result === 'string' ? JSON.parse(row.result) : row.result;
    const testInfoValue = row.test_info ? 
      (typeof row.test_info === 'string' ? JSON.parse(row.test_info) : row.test_info) : 
      undefined;

    if (!resultValue || typeof resultValue !== 'object' || !('score' in resultValue)) {
      throw new Error(`Invalid MetricResult format: ${JSON.stringify(resultValue)}`);
    }

    return {
      input: row.input as string,
      output: row.output as string,
      result: resultValue as MetricResult,
      agentName: row.agent_name as string,
      metricName: row.metric_name as string,
      instructions: row.instructions as string,
      testInfo: testInfoValue as TestInfo,
      globalRunId: row.global_run_id as string,
      runId: row.run_id as string,
      createdAt: row.created_at as string,
    };
  }

  async getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]> {
    try {
      const client = await this.getClient();
      const baseQuery = `SELECT * FROM ${TABLE_EVALS} WHERE agent_name = $1`;
      
      let typeCondition = '';
      if (type === 'test') {
        typeCondition = " AND test_info IS NOT NULL AND test_info->>'testPath' IS NOT NULL";
      } else if (type === 'live') {
        typeCondition = " AND (test_info IS NULL OR test_info->>'testPath' IS NULL)";
      }

      const result = await client.query(
        `${baseQuery}${typeCondition} ORDER BY created_at DESC`,
        [agentName]
      );

      return (result.rows?.map(row => this.transformEvalRow(row as Record<string, any>)) ?? []);
    } catch (error) {
      // Handle case where table doesn't exist yet
      if (error instanceof Error && error.message.includes('no such table')) {
        return [];
      }
      this.logger.error('Failed to get evals for the specified agent: ' + (error as any)?.message);
      throw error;
    }
  }

  async getTraces(
    {
      name,
      scope,
      page,
      perPage,
      attributes,
    }: { name?: string; scope?: string; page: number; perPage: number; attributes?: Record<string, string> } = {
      page: 0,
      perPage: 100,
    },
  ): Promise<any[]> {
    const limit = perPage;
    const offset = page * perPage;

    const args: any[] = [];

    const conditions: string[] = [];
    if (name) {
      conditions.push("name LIKE $" + (args.length + 1) + " || '%'");
      args.push(name);
    }
    if (scope) {
      conditions.push('scope = $' + (args.length + 1));
      args.push(scope);
    }
    if (attributes) {
      Object.keys(attributes).forEach(key => {
        conditions.push(`attributes->>'${key}' = $${args.length + 1}`);
      });
    }

    if (attributes) {
      for (const [_key, value] of Object.entries(attributes)) {
        args.push(value);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    args.push(limit, offset);

    const client = await this.getClient();
    const result = await client.query<TraceRow>(
      `SELECT * FROM ${TABLE_TRACES} ${whereClause} ORDER BY "startTime" DESC LIMIT $${args.length-1} OFFSET $${args.length}`,
      args
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map(row => ({
      id: row.id,
      parentSpanId: row.parentSpanId,
      traceId: row.traceId,
      name: row.name,
      scope: row.scope,
      kind: row.kind,
      status: safelyParseJSON(row.status as string),
      events: safelyParseJSON(row.events as string),
      links: safelyParseJSON(row.links as string),
      attributes: safelyParseJSON(row.attributes as string),
      startTime: row.startTime,
      endTime: row.endTime,
      other: safelyParseJSON(row.other as string),
      createdAt: row.createdAt,
    })) as any;
  }
}

export { PGliteStore as DefaultStorage };