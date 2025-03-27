import { MastraStorage } from './chunk-BFE62BHD.js';

// src/storage/default-proxy-storage.ts
var DefaultProxyStorage = class extends MastraStorage {
  storage = null;
  storageConfig;
  isInitializingPromise = null;
  constructor({ config }) {
    super({ name: "DefaultStorage" });
    this.storageConfig = config;
  }
  setupStorage() {
    if (!this.isInitializingPromise) {
      this.isInitializingPromise = new Promise((resolve, reject) => {
        import('./storage/libsql/index.js').then(({ DefaultStorage }) => {
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

export { DefaultProxyStorage };
