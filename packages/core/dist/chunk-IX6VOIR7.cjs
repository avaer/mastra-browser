'use strict';

var chunkF5UYWPV4_cjs = require('./chunk-F5UYWPV4.cjs');
var chunkUV2QUUKW_cjs = require('./chunk-UV2QUUKW.cjs');

// src/storage/base.ts
var MastraStorage = class extends chunkUV2QUUKW_cjs.MastraBase {
  /** @deprecated import from { TABLE_WORKFLOW_SNAPSHOT } '@mastra/core/storage' instead */
  static TABLE_WORKFLOW_SNAPSHOT = chunkF5UYWPV4_cjs.TABLE_WORKFLOW_SNAPSHOT;
  /** @deprecated import from { TABLE_EVALS } '@mastra/core/storage' instead */
  static TABLE_EVALS = chunkF5UYWPV4_cjs.TABLE_EVALS;
  /** @deprecated import from { TABLE_MESSAGES } '@mastra/core/storage' instead */
  static TABLE_MESSAGES = chunkF5UYWPV4_cjs.TABLE_MESSAGES;
  /** @deprecated import from { TABLE_THREADS } '@mastra/core/storage' instead */
  static TABLE_THREADS = chunkF5UYWPV4_cjs.TABLE_THREADS;
  /** @deprecated import { TABLE_TRACES } from '@mastra/core/storage' instead */
  static TABLE_TRACES = chunkF5UYWPV4_cjs.TABLE_TRACES;
  hasInitialized = null;
  shouldCacheInit = true;
  constructor({ name }) {
    super({
      component: "STORAGE",
      name
    });
  }
  async __batchInsert({
    tableName,
    records
  }) {
    await this.init();
    return this.batchInsert({ tableName, records });
  }
  async __getThreadById({ threadId }) {
    await this.init();
    return this.getThreadById({ threadId });
  }
  async __getThreadsByResourceId({ resourceId }) {
    await this.init();
    return this.getThreadsByResourceId({ resourceId });
  }
  async __saveThread({ thread }) {
    await this.init();
    return this.saveThread({ thread });
  }
  async __updateThread({
    id,
    title,
    metadata
  }) {
    await this.init();
    return this.updateThread({ id, title, metadata });
  }
  async __deleteThread({ threadId }) {
    await this.init();
    return this.deleteThread({ threadId });
  }
  async __getMessages({ threadId, selectBy, threadConfig }) {
    await this.init();
    return this.getMessages({ threadId, selectBy, threadConfig });
  }
  async __saveMessages({ messages }) {
    await this.init();
    return this.saveMessages({ messages });
  }
  async __getTraces({
    scope,
    page,
    perPage,
    attributes
  }) {
    await this.init();
    return this.getTraces({ scope, page, perPage, attributes });
  }
  async init() {
    if (this.shouldCacheInit && await this.hasInitialized) {
      return;
    }
    this.hasInitialized = Promise.all([
      this.createTable({
        tableName: chunkF5UYWPV4_cjs.TABLE_WORKFLOW_SNAPSHOT,
        schema: {
          workflow_name: {
            type: "text"
          },
          run_id: {
            type: "text"
          },
          snapshot: {
            type: "text"
          },
          createdAt: {
            type: "timestamp"
          },
          updatedAt: {
            type: "timestamp"
          }
        }
      }),
      this.createTable({
        tableName: chunkF5UYWPV4_cjs.TABLE_EVALS,
        schema: {
          input: {
            type: "text"
          },
          output: {
            type: "text"
          },
          result: {
            type: "jsonb"
          },
          agent_name: {
            type: "text"
          },
          metric_name: {
            type: "text"
          },
          instructions: {
            type: "text"
          },
          test_info: {
            type: "jsonb",
            nullable: true
          },
          global_run_id: {
            type: "text"
          },
          run_id: {
            type: "text"
          },
          created_at: {
            type: "timestamp"
          }
        }
      }),
      this.createTable({
        tableName: chunkF5UYWPV4_cjs.TABLE_THREADS,
        schema: {
          id: { type: "text", nullable: false, primaryKey: true },
          resourceId: { type: "text", nullable: false },
          title: { type: "text", nullable: false },
          metadata: { type: "text", nullable: true },
          createdAt: { type: "timestamp", nullable: false },
          updatedAt: { type: "timestamp", nullable: false }
        }
      }),
      this.createTable({
        tableName: chunkF5UYWPV4_cjs.TABLE_MESSAGES,
        schema: {
          id: { type: "text", nullable: false, primaryKey: true },
          thread_id: { type: "text", nullable: false },
          content: { type: "text", nullable: false },
          role: { type: "text", nullable: false },
          type: { type: "text", nullable: false },
          createdAt: { type: "timestamp", nullable: false }
        }
      }),
      this.createTable({
        tableName: chunkF5UYWPV4_cjs.TABLE_TRACES,
        schema: {
          id: { type: "text", nullable: false, primaryKey: true },
          parentSpanId: { type: "text", nullable: true },
          name: { type: "text", nullable: false },
          traceId: { type: "text", nullable: false },
          scope: { type: "text", nullable: false },
          kind: { type: "integer", nullable: false },
          attributes: { type: "jsonb", nullable: true },
          status: { type: "jsonb", nullable: true },
          events: { type: "jsonb", nullable: true },
          links: { type: "jsonb", nullable: true },
          other: { type: "text", nullable: true },
          startTime: { type: "bigint", nullable: false },
          endTime: { type: "bigint", nullable: false },
          createdAt: { type: "timestamp", nullable: false }
        }
      })
    ]).then(() => true);
    await this.hasInitialized;
  }
  async persistWorkflowSnapshot({
    workflowName,
    runId,
    snapshot
  }) {
    await this.init();
    const data = {
      workflow_name: workflowName,
      run_id: runId,
      snapshot,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.logger.debug("Persisting workflow snapshot", { workflowName, runId, data });
    await this.insert({
      tableName: chunkF5UYWPV4_cjs.TABLE_WORKFLOW_SNAPSHOT,
      record: data
    });
  }
  async loadWorkflowSnapshot({
    workflowName,
    runId
  }) {
    if (!this.hasInitialized) {
      await this.init();
    }
    this.logger.debug("Loading workflow snapshot", { workflowName, runId });
    const d = await this.load({
      tableName: chunkF5UYWPV4_cjs.TABLE_WORKFLOW_SNAPSHOT,
      keys: { workflow_name: workflowName, run_id: runId }
    });
    return d ? d.snapshot : null;
  }
  async __getEvalsByAgentName(agentName, type) {
    await this.init();
    return this.getEvalsByAgentName(agentName, type);
  }
};

exports.MastraStorage = MastraStorage;
