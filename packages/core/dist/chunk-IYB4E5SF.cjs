'use strict';

var chunkOJDVHIBJ_cjs = require('./chunk-OJDVHIBJ.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var zod = require('zod');

// src/integration/integration.ts
var _Integration = class _Integration {
  constructor() {
    chunk7D636BPD_cjs.__publicField(this, "name", "Integration");
    chunk7D636BPD_cjs.__publicField(this, "workflows");
    this.workflows = {};
  }
  /**
   * Workflows
   */
  registerWorkflow(name, fn) {
    if (this.workflows[name]) {
      throw new Error(`Sync function "${name}" already registered`);
    }
    this.workflows[name] = fn;
  }
  getWorkflows({ serialized }) {
    if (serialized) {
      return Object.entries(this.workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return this.workflows;
  }
  /**
   * TOOLS
   */
  getStaticTools(_params) {
    throw new Error("Method not implemented.");
  }
  async getTools(_params) {
    throw new Error("Method not implemented.");
  }
  async getApiClient() {
    throw new Error("Method not implemented");
  }
};
chunk7D636BPD_cjs.__name(_Integration, "Integration");
var Integration = _Integration;
var _OpenAPIToolset = class _OpenAPIToolset {
  constructor() {
    chunk7D636BPD_cjs.__publicField(this, "authType", "API_KEY");
  }
  get toolSchemas() {
    return {};
  }
  get toolDocumentations() {
    return {};
  }
  get baseClient() {
    return {};
  }
  async getApiClient() {
    throw new Error("API not implemented");
  }
  _generateIntegrationTools() {
    const { client, ...clientMethods } = this.baseClient;
    const schemas = this.toolSchemas;
    const documentations = this.toolDocumentations;
    const tools = Object.keys(clientMethods).reduce((acc, key) => {
      const comment = documentations[key]?.comment;
      const fallbackComment = `Execute ${key}`;
      const tool = chunkOJDVHIBJ_cjs.createTool({
        id: key,
        inputSchema: schemas[key] || zod.z.object({}),
        description: comment || fallbackComment,
        // documentation: doc || fallbackComment,
        execute: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async ({ context }) => {
          const client2 = await this.getApiClient();
          const value = client2[key];
          return value({
            ...context
          });
        }, "execute")
      });
      return { ...acc, [key]: tool };
    }, {});
    return tools;
  }
};
chunk7D636BPD_cjs.__name(_OpenAPIToolset, "OpenAPIToolset");
var OpenAPIToolset = _OpenAPIToolset;

exports.Integration = Integration;
exports.OpenAPIToolset = OpenAPIToolset;
//# sourceMappingURL=chunk-IYB4E5SF.cjs.map
//# sourceMappingURL=chunk-IYB4E5SF.cjs.map