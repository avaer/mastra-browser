import { MastraBase } from './chunk-LE72NI7K.js';
import { __name, __publicField } from './chunk-WH5OY6PO.js';

// src/vector/vector.ts
var _MastraVector = class _MastraVector extends MastraBase {
  constructor() {
    super({ name: "MastraVector", component: "VECTOR" });
    __publicField(this, "baseKeys", {
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
__name(_MastraVector, "MastraVector");
var MastraVector = _MastraVector;

export { MastraVector };
//# sourceMappingURL=chunk-I4XYJ73M.js.map
//# sourceMappingURL=chunk-I4XYJ73M.js.map