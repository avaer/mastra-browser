'use strict';

var chunkI3R2VONK_cjs = require('./chunk-I3R2VONK.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/storage/default-proxy-storage.ts
var _DefaultProxyStorage = class _DefaultProxyStorage extends chunkI3R2VONK_cjs.MastraStorage {
  constructor({ config }) {
    super({ name: "DefaultStorage" });
    chunk7D636BPD_cjs.__publicField(this, "storage", null);
    chunk7D636BPD_cjs.__publicField(this, "storageConfig");
    chunk7D636BPD_cjs.__publicField(this, "isInitializingPromise", null);
    this.storageConfig = config;
  }
  setupStorage() {
    if (!this.isInitializingPromise) {
      this.isInitializingPromise = new Promise((resolve, reject) => {
        import('./storage/pglite/index.cjs').then(({ DefaultStorage }) => {
          this.storage = new DefaultStorage({ config: this.storageConfig });
          resolve();
        }).catch(reject);
      });
    }
    return this.isInitializingPromise;
  }
  async createTable({
    tableName,
    schema
  }) {
    await this.setupStorage();
    return this.storage.createTable({ tableName, schema });
  }
  async clearTable({ tableName }) {
    await this.setupStorage();
    return this.storage.clearTable({ tableName });
  }
  async insert({ tableName, record }) {
    await this.setupStorage();
    return this.storage.insert({ tableName, record });
  }
  async batchInsert({ tableName, records }) {
    await this.setupStorage();
    return this.storage.batchInsert({ tableName, records });
  }
  async load({ tableName, keys }) {
    await this.setupStorage();
    return this.storage.load({ tableName, keys });
  }
  async getThreadById({ threadId }) {
    await this.setupStorage();
    return this.storage.getThreadById({ threadId });
  }
  async getThreadsByResourceId({ resourceId }) {
    await this.setupStorage();
    return this.storage.getThreadsByResourceId({ resourceId });
  }
  async saveThread({ thread }) {
    await this.setupStorage();
    return this.storage.saveThread({ thread });
  }
  async updateThread({
    id,
    title,
    metadata
  }) {
    await this.setupStorage();
    return this.storage.updateThread({ id, title, metadata });
  }
  async deleteThread({ threadId }) {
    await this.setupStorage();
    return this.storage.deleteThread({ threadId });
  }
  async getMessages({ threadId, selectBy }) {
    await this.setupStorage();
    return this.storage.getMessages({ threadId, selectBy });
  }
  async saveMessages({ messages }) {
    await this.setupStorage();
    return this.storage.saveMessages({ messages });
  }
  async getEvalsByAgentName(agentName, type) {
    await this.setupStorage();
    return this.storage.getEvalsByAgentName(agentName, type);
  }
  async getTraces(options) {
    await this.setupStorage();
    return this.storage.getTraces(options);
  }
};
chunk7D636BPD_cjs.__name(_DefaultProxyStorage, "DefaultProxyStorage");
var DefaultProxyStorage = _DefaultProxyStorage;

exports.DefaultProxyStorage = DefaultProxyStorage;
//# sourceMappingURL=chunk-LWKQDYNK.cjs.map
//# sourceMappingURL=chunk-LWKQDYNK.cjs.map