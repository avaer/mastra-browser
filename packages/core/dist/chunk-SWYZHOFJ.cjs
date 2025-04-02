'use strict';

var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/vector/vector.ts
var _MastraVector = class _MastraVector extends chunkSUWCCDLE_cjs.MastraBase {
  constructor() {
    super({ name: "MastraVector", component: "VECTOR" });
    chunk7D636BPD_cjs.__publicField(this, "baseKeys", {
      query: ["queryVector", "topK", "filter", "includeVector"],
      upsert: ["vectors", "metadata", "ids"],
      createIndex: ["dimension", "metric"]
    });
  }
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
chunk7D636BPD_cjs.__name(_MastraVector, "MastraVector");
var MastraVector = _MastraVector;

exports.MastraVector = MastraVector;
//# sourceMappingURL=chunk-SWYZHOFJ.cjs.map
//# sourceMappingURL=chunk-SWYZHOFJ.cjs.map