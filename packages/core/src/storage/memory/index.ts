import type { MetricResult, TestInfo } from '../../eval';
import type { MessageType, StorageThreadType } from '../../memory/types';
import type { WorkflowRunState } from '../../workflows';
import { MastraStorage } from '../base';
import { TABLE_EVALS, TABLE_MESSAGES, TABLE_THREADS, TABLE_TRACES, TABLE_WORKFLOW_SNAPSHOT } from '../constants';
import type { TABLE_NAMES } from '../constants';
import type { EvalRow, StorageColumn, StorageGetMessagesArg, WorkflowRuns } from '../types';

/** Helper function to safely parse JSON strings */
function safelyParseJSON(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

/** Helper type for our in-memory record collections */
type MemoryCollection<T = Record<string, any>> = Map<string, T>;

export class MemoryStore extends MastraStorage {
  private collections: Record<TABLE_NAMES, MemoryCollection> = {
    [TABLE_WORKFLOW_SNAPSHOT]: new Map(),
    [TABLE_EVALS]: new Map(),
    [TABLE_MESSAGES]: new Map(),
    [TABLE_THREADS]: new Map(),
    [TABLE_TRACES]: new Map(),
  };

  private schemas: Record<TABLE_NAMES, Record<string, StorageColumn>> = {};

  constructor({ name = 'MemoryStore' }: { name?: string } = {}) {
    super({ name });
    // In-memory storage doesn't need to cache init state
    this.shouldCacheInit = false;
  }

  async createTable({
    tableName,
    schema,
  }: {
    tableName: TABLE_NAMES;
    schema: Record<string, StorageColumn>;
  }): Promise<void> {
    // For in-memory, just store the schema and ensure the collection exists
    this.schemas[tableName] = schema;
    if (!this.collections[tableName]) {
      this.collections[tableName] = new Map();
    }
    this.logger.debug(`Created in-memory table`, { tableName, operation: 'schema init' });
  }

  async clearTable({ tableName }: { tableName: TABLE_NAMES }): Promise<void> {
    if (this.collections[tableName]) {
      this.collections[tableName].clear();
    }
  }

  /** Create a composite key for multi-key records */
  private createCompositeKey(keys: Record<string, string>): string {
    return Object.entries(keys)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join('|');
  }

  /** Prepare record for storage by serializing objects and dates */
  private prepareRecord(record: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => {
        if (value === undefined) {
          return [key, null];
        } else if (value instanceof Date) {
          return [key, value.toISOString()];
        } else if (typeof value === 'object') {
          return [key, JSON.stringify(value)];
        } else {
          return [key, value];
        }
      })
    );
  }

  async insert({ tableName, record }: { tableName: TABLE_NAMES; record: Record<string, any> }): Promise<void> {
    try {
      const collection = this.collections[tableName];
      const preparedRecord = this.prepareRecord(record);

      // Find primary key field from schema
      const pkField = Object.entries(this.schemas[tableName] || {}).find(
        ([_, schema]) => schema.primaryKey
      )?.[0];

      let key: string;

      // For workflow snapshot table, use composite key of workflow_name and run_id
      if (tableName === TABLE_WORKFLOW_SNAPSHOT) {
        key = this.createCompositeKey({
          workflow_name: record.workflow_name,
          run_id: record.run_id,
        });
      } else if (pkField && record[pkField]) {
        // If we have a primary key field and value, use that
        key = record[pkField];
      } else {
        // Otherwise generate a key from the record values
        key = JSON.stringify(preparedRecord);
      }

      collection.set(key, preparedRecord);
    } catch (error) {
      this.logger.error(`Error inserting into table ${tableName}: ${error}`);
      throw error;
    }
  }

  async batchInsert({
    tableName,
    records,
  }: {
    tableName: TABLE_NAMES;
    records: Record<string, any>[];
  }): Promise<void> {
    if (records.length === 0) return;

    try {
      for (const record of records) {
        await this.insert({ tableName, record });
      }
    } catch (error) {
      this.logger.error(`Error batch inserting into table ${tableName}: ${error}`);
      throw error;
    }
  }

  async load<R>({ tableName, keys }: { tableName: TABLE_NAMES; keys: Record<string, string> }): Promise<R | null> {
    const collection = this.collections[tableName];

    // For workflow snapshot table, use composite key
    if (tableName === TABLE_WORKFLOW_SNAPSHOT) {
      const compositeKey = this.createCompositeKey(keys);
      const record = collection.get(compositeKey);
      if (!record) return null;

      // Parse JSON fields and convert dates
      return this.parseRecord(record) as R;
    }

    // For other tables with a specific primary key field
    const pkField = Object.entries(this.schemas[tableName] || {}).find(
      ([_, schema]) => schema.primaryKey
    )?.[0];

    if (pkField && keys[pkField]) {
      const record = collection.get(keys[pkField]);
      if (!record) return null;
      return this.parseRecord(record) as R;
    }

    // If no primary key, search by field value matching
    for (const [_, record] of collection.entries()) {
      const matches = Object.entries(keys).every(
        ([key, value]) => record[key] !== undefined && record[key] === value
      );

      if (matches) {
        return this.parseRecord(record) as R;
      }
    }

    return null;
  }

  /** Parse record from storage by deserializing JSON strings */
  private parseRecord(record: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => {
        if (typeof value === 'string') {
          try {
            // Check if the string looks like JSON
            if (value.startsWith('{') || value.startsWith('[')) {
              return [key, JSON.parse(value)];
            }
          } catch {}
        }
        return [key, value];
      })
    );
  }

  async getThreadById({ threadId }: { threadId: string }): Promise<StorageThreadType | null> {
    const result = await this.load<StorageThreadType>({
      tableName: TABLE_THREADS,
      keys: { id: threadId },
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      metadata: typeof result.metadata === 'string' ? JSON.parse(result.metadata as string) : result.metadata,
      createdAt: typeof result.createdAt === 'string' ? new Date(result.createdAt) : result.createdAt,
      updatedAt: typeof result.updatedAt === 'string' ? new Date(result.updatedAt) : result.updatedAt,
    };
  }

  async getThreadsByResourceId({ resourceId }: { resourceId: string }): Promise<StorageThreadType[]> {
    const collection = this.collections[TABLE_THREADS];
    const results: StorageThreadType[] = [];

    for (const [_, record] of collection.entries()) {
      if (record.resourceId === resourceId) {
        results.push({
          id: record.id,
          resourceId: record.resourceId,
          title: record.title,
          createdAt: typeof record.createdAt === 'string' ? new Date(record.createdAt) : record.createdAt,
          updatedAt: typeof record.updatedAt === 'string' ? new Date(record.updatedAt) : record.updatedAt,
          metadata: typeof record.metadata === 'string' ? JSON.parse(record.metadata) : record.metadata,
        } as StorageThreadType);
      }
    }

    return results;
  }

  async saveThread({ thread }: { thread: StorageThreadType }): Promise<StorageThreadType> {
    await this.insert({
      tableName: TABLE_THREADS,
      record: {
        ...thread,
        metadata: typeof thread.metadata === 'object' ? JSON.stringify(thread.metadata) : thread.metadata,
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
      updatedAt: new Date(),
    };

    await this.insert({
      tableName: TABLE_THREADS,
      record: {
        ...updatedThread,
        metadata: JSON.stringify(updatedThread.metadata),
      },
    });

    return updatedThread;
  }

  async deleteThread({ threadId }: { threadId: string }): Promise<void> {
    // Delete the thread
    const threadsCollection = this.collections[TABLE_THREADS];
    threadsCollection.delete(threadId);

    // Delete associated messages
    const messagesCollection = this.collections[TABLE_MESSAGES];
    for (const [key, message] of messagesCollection.entries()) {
      if (message.thread_id === threadId) {
        messagesCollection.delete(key);
      }
    }
  }

  /** Parse message from storage format to MessageType */
  private parseMessage(record: any): MessageType {
    let content = record.content;
    try {
      if (typeof content === 'string') {
        content = JSON.parse(content);
      }
    } catch {
      // Use content as is if it's not JSON
    }

    return {
      id: record.id,
      content,
      role: record.role,
      type: record.type,
      createdAt: typeof record.createdAt === 'string' ? new Date(record.createdAt) : record.createdAt,
      threadId: record.thread_id,
      resourceId: record.resourceId || '',
      toolCallIds: record.toolCallIds,
      toolCallArgs: record.toolCallArgs,
      toolNames: record.toolNames,
    } as MessageType;
  }

  async getMessages({ threadId, selectBy }: StorageGetMessagesArg): Promise<MessageType[]> {
    try {
      const messagesCollection = this.collections[TABLE_MESSAGES];
      let messages: MessageType[] = [];

      // Find all messages for this thread
      for (const [_, record] of messagesCollection.entries()) {
        if (record.thread_id === threadId) {
          messages.push(this.parseMessage(record));
        }
      }

      // Sort all messages by creation date
      messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      // Handle include specific messages
      if (selectBy?.include?.length) {
        const includeIds = new Set(selectBy.include.map(i => i.id));
        const includeWithContext: Record<string, { prev: number; next: number }> = {};

        // Build map of message IDs with context requirements
        for (const include of selectBy.include) {
          includeWithContext[include.id] = {
            prev: include.withPreviousMessages || 0,
            next: include.withNextMessages || 0,
          };
        }

        // Create a map to track which messages to include
        const indexMap = new Map<string, number>();
        messages.forEach((msg, idx) => indexMap.set(msg.id, idx));

        // Keep track of which messages to include in final result
        const toInclude = new Set<number>();

        // For each requested message, include context
        for (const [id, context] of Object.entries(includeWithContext)) {
          const idx = indexMap.get(id);
          if (idx !== undefined) {
            // Include the message itself and context
            const startIdx = Math.max(0, idx - context.prev);
            const endIdx = Math.min(messages.length - 1, idx + context.next);

            for (let i = startIdx; i <= endIdx; i++) {
              toInclude.add(i);
            }
          }
        }

        // Filter out messages that weren't tagged for inclusion
        const includedMessages = Array.from(toInclude)
          .sort((a, b) => a - b)
          .map(idx => messages[idx]);

        // If we have included messages, use those
        if (includedMessages.length > 0) {
          messages = includedMessages;
        }
      }

      // Handle limit of messages
      if (typeof selectBy?.last === 'number' && selectBy.last > 0) {
        messages = messages.slice(-selectBy.last);
      }

      return messages;
    } catch (error) {
      this.logger.error('Error getting messages:', error as Error);
      throw error;
    }
  }

  async saveMessages({ messages }: { messages: MessageType[] }): Promise<MessageType[]> {
    if (messages.length === 0) return messages;

    try {
      const threadId = messages[0]?.threadId;
      if (!threadId) {
        throw new Error('Thread ID is required');
      }

      // Insert each message
      for (const message of messages) {
        const time = message.createdAt || new Date();
        await this.insert({
          tableName: TABLE_MESSAGES,
          record: {
            id: message.id,
            thread_id: threadId,
            content: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
            role: message.role,
            type: message.type,
            createdAt: time instanceof Date ? time.toISOString() : time,
            resourceId: message.resourceId || '',
            toolCallIds: message.toolCallIds ? JSON.stringify(message.toolCallIds) : undefined,
            toolCallArgs: message.toolCallArgs ? JSON.stringify(message.toolCallArgs) : undefined,
            toolNames: message.toolNames ? JSON.stringify(message.toolNames) : undefined,
          },
        });
      }

      return messages;
    } catch (error) {
      this.logger.error('Failed to save messages in database: ' + (error as { message: string })?.message);
      throw error;
    }
  }

  /** Transform eval row from storage format to EvalRow */
  private transformEvalRow(row: Record<string, any>): EvalRow {
    const resultValue = typeof row.result === 'string' ? JSON.parse(row.result) : row.result;
    const testInfoValue = row.test_info
      ? typeof row.test_info === 'string'
        ? JSON.parse(row.test_info)
        : row.test_info
      : undefined;

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
      const evalsCollection = this.collections[TABLE_EVALS];
      const results: EvalRow[] = [];

      for (const [_, row] of evalsCollection.entries()) {
        if (row.agent_name !== agentName) continue;

        // Check if we need to filter by test info
        if (type) {
          const testInfo = typeof row.test_info === 'string' ? safelyParseJSON(row.test_info) : row.test_info;

          if (type === 'test' && (!testInfo || !testInfo.testPath)) continue;
          if (type === 'live' && testInfo && testInfo.testPath) continue;
        }

        // Passed all filters, include this row
        results.push(this.transformEvalRow(row));
      }

      // Sort by created_at in descending order
      return results.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });
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
      filters,
    }: {
      name?: string;
      scope?: string;
      page: number;
      perPage: number;
      attributes?: Record<string, string>;
      filters?: Record<string, any>;
    } = {
      page: 0,
      perPage: 100,
    },
  ): Promise<any[]> {
    const tracesCollection = this.collections[TABLE_TRACES];
    const results: any[] = [];

    // Filter trace entries based on conditions
    for (const [_, row] of tracesCollection.entries()) {
      const parsedRow = this.parseRecord(row);

      // Apply filters
      if (name && !parsedRow.name.startsWith(name)) continue;
      if (scope && parsedRow.scope !== scope) continue;

      // Check attribute filters
      if (attributes) {
        const rowAttrs = typeof parsedRow.attributes === 'string' 
          ? safelyParseJSON(parsedRow.attributes) 
          : parsedRow.attributes || {};

        const attributesMatch = Object.entries(attributes).every(
          ([key, value]) => rowAttrs[key] === value
        );

        if (!attributesMatch) continue;
      }

      // Check other custom filters
      if (filters) {
        const filtersMatch = Object.entries(filters).every(
          ([key, value]) => parsedRow[key] === value
        );

        if (!filtersMatch) continue;
      }

      // All filters passed, include this row
      results.push({
        id: parsedRow.id,
        parentSpanId: parsedRow.parentSpanId,
        traceId: parsedRow.traceId,
        name: parsedRow.name,
        scope: parsedRow.scope,
        kind: parsedRow.kind,
        status: typeof parsedRow.status === 'string' ? safelyParseJSON(parsedRow.status) : parsedRow.status,
        events: typeof parsedRow.events === 'string' ? safelyParseJSON(parsedRow.events) : parsedRow.events,
        links: typeof parsedRow.links === 'string' ? safelyParseJSON(parsedRow.links) : parsedRow.links,
        attributes: typeof parsedRow.attributes === 'string' ? safelyParseJSON(parsedRow.attributes) : parsedRow.attributes,
        startTime: parsedRow.startTime,
        endTime: parsedRow.endTime,
        other: typeof parsedRow.other === 'string' ? safelyParseJSON(parsedRow.other) : parsedRow.other,
        createdAt: parsedRow.createdAt,
      });
    }

    // Sort by startTime in descending order
    results.sort((a, b) => Number(b.startTime) - Number(a.startTime));

    // Apply pagination
    const offset = page * perPage;
    return results.slice(offset, offset + perPage);
  }

  async getWorkflowRuns({
    namespace,
    workflowName,
    fromDate,
    toDate,
    limit,
    offset,
  }: {
    namespace?: string;
    workflowName?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  } = {}): Promise<WorkflowRuns> {
    const workflowsCollection = this.collections[TABLE_WORKFLOW_SNAPSHOT];
    const results: Array<{
      workflowName: string;
      runId: string;
      snapshot: WorkflowRunState | string;
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    // Filter workflow runs based on conditions
    for (const [_, row] of workflowsCollection.entries()) {
      const parsedRow = this.parseRecord(row);

      // Filter by workflow name if provided
      if (workflowName && parsedRow.workflow_name !== workflowName) continue;

      // Filter by namespace if provided (from workflow name)
      if (namespace) {
        const rowNamespace = parsedRow.workflow_name?.split('/')[0];
        if (rowNamespace !== namespace) continue;
      }

      // Filter by date range
      const createdAt = typeof parsedRow.createdAt === 'string' 
        ? new Date(parsedRow.createdAt) 
        : parsedRow.createdAt;
      
      if (fromDate && createdAt < fromDate) continue;
      if (toDate && createdAt > toDate) continue;

      // Process snapshot
      let parsedSnapshot: WorkflowRunState | string = parsedRow.snapshot;
      if (typeof parsedSnapshot === 'string') {
        try {
          parsedSnapshot = JSON.parse(parsedSnapshot) as WorkflowRunState;
        } catch (e) {
          // If parsing fails, return the raw snapshot string
          console.warn(`Failed to parse snapshot for workflow ${parsedRow.workflow_name}: ${e}`);
        }
      }

      // All filters passed, include this row
      results.push({
        workflowName: parsedRow.workflow_name,
        runId: parsedRow.run_id,
        snapshot: parsedSnapshot,
        createdAt: typeof parsedRow.createdAt === 'string' ? new Date(parsedRow.createdAt) : parsedRow.createdAt,
        updatedAt: typeof parsedRow.updatedAt === 'string' ? new Date(parsedRow.updatedAt) : parsedRow.updatedAt,
      });
    }

    // Sort by createdAt in descending order
    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Get total count before pagination
    const total = results.length;

    // Apply pagination if specified
    let paginatedResults = results;
    if (typeof offset === 'number' && typeof limit === 'number') {
      paginatedResults = results.slice(offset, offset + limit);
    }

    return { runs: paginatedResults, total };
  }
}

// Export as default storage adapter
export { MemoryStore as DefaultStorage };
