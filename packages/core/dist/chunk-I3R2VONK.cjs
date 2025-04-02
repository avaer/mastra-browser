'use strict';

var chunkJOQIBQ7H_cjs = require('./chunk-JOQIBQ7H.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/storage/base.ts
var _MastraStorage = class _MastraStorage extends chunkSUWCCDLE_cjs.MastraBase {
  constructor({ name }) {
    super({
      component: "STORAGE",
      name
    });
    chunk7D636BPD_cjs.__publicField(this, "hasInitialized", null);
    chunk7D636BPD_cjs.__publicField(this, "shouldCacheInit", true);
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
        tableName: chunkJOQIBQ7H_cjs.TABLE_WORKFLOW_SNAPSHOT,
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
        tableName: chunkJOQIBQ7H_cjs.TABLE_EVALS,
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
        tableName: chunkJOQIBQ7H_cjs.TABLE_THREADS,
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
        tableName: chunkJOQIBQ7H_cjs.TABLE_MESSAGES,
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
        tableName: chunkJOQIBQ7H_cjs.TABLE_TRACES,
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
      tableName: chunkJOQIBQ7H_cjs.TABLE_WORKFLOW_SNAPSHOT,
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
      tableName: chunkJOQIBQ7H_cjs.TABLE_WORKFLOW_SNAPSHOT,
      keys: { workflow_name: workflowName, run_id: runId }
    });
    return d ? d.snapshot : null;
  }
  async __getEvalsByAgentName(agentName, type) {
    await this.init();
    return this.getEvalsByAgentName(agentName, type);
  }
};
chunk7D636BPD_cjs.__name(_MastraStorage, "MastraStorage");
/** @deprecated import from { TABLE_WORKFLOW_SNAPSHOT } '@mastra/core/storage' instead */
chunk7D636BPD_cjs.__publicField(_MastraStorage, "TABLE_WORKFLOW_SNAPSHOT", chunkJOQIBQ7H_cjs.TABLE_WORKFLOW_SNAPSHOT);
/** @deprecated import from { TABLE_EVALS } '@mastra/core/storage' instead */
chunk7D636BPD_cjs.__publicField(_MastraStorage, "TABLE_EVALS", chunkJOQIBQ7H_cjs.TABLE_EVALS);
/** @deprecated import from { TABLE_MESSAGES } '@mastra/core/storage' instead */
chunk7D636BPD_cjs.__publicField(_MastraStorage, "TABLE_MESSAGES", chunkJOQIBQ7H_cjs.TABLE_MESSAGES);
/** @deprecated import from { TABLE_THREADS } '@mastra/core/storage' instead */
chunk7D636BPD_cjs.__publicField(_MastraStorage, "TABLE_THREADS", chunkJOQIBQ7H_cjs.TABLE_THREADS);
/** @deprecated import { TABLE_TRACES } from '@mastra/core/storage' instead */
chunk7D636BPD_cjs.__publicField(_MastraStorage, "TABLE_TRACES", chunkJOQIBQ7H_cjs.TABLE_TRACES);
var MastraStorage = _MastraStorage;

exports.MastraStorage = MastraStorage;
//# sourceMappingURL=chunk-I3R2VONK.cjs.map
//# sourceMappingURL=chunk-I3R2VONK.cjs.map