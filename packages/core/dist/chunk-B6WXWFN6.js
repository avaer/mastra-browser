import { MastraBase } from './chunk-WUPACWA6.js';

// src/vector/vector.ts
var MastraVector = class extends MastraBase {
  constructor() {
    super({ name: "MastraVector", component: "VECTOR" });
  }
  baseKeys = {
    query: ["queryVector", "topK", "filter", "includeVector"],
    upsert: ["vectors", "metadata", "ids"],
    createIndex: ["dimension", "metric"]
  };
  normalizeArgs(method, [first, ...rest], extendedKeys = []) {
    if (typeof first === "object") {
      return first;
    }
    this.logger.warn(
      `Deprecation Warning: Passing individual arguments to ${method}() is deprecated. Please use an object parameter instead.`
    );
    const baseKeys = this.baseKeys[method] || [];
    const paramKeys = [...baseKeys, ...extendedKeys].slice(0, rest.length);
    return {
      indexName: first,
      ...Object.fromEntries(paramKeys.map((key, i) => [key, rest[i]]))
    };
  }
  async updateIndexById(_indexName, _id, _update) {
    throw new Error("updateIndexById is not implemented yet");
  }
  async deleteIndexById(_indexName, _id) {
    throw new Error("deleteById is not implemented yet");
  }
};

export { MastraVector };
