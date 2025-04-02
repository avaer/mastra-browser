import { createTool } from './chunk-YNOU42YW.js';
import { __name, __publicField } from './chunk-WH5OY6PO.js';
import { z } from 'zod';

// src/integration/integration.ts
var _Integration = class _Integration {
  constructor() {
    __publicField(this, "name", "Integration");
    __publicField(this, "workflows");
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
__name(_Integration, "Integration");
var Integration = _Integration;
var _OpenAPIToolset = class _OpenAPIToolset {
  constructor() {
    __publicField(this, "authType", "API_KEY");
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
      const tool = createTool({
        id: key,
        inputSchema: schemas[key] || z.object({}),
        description: comment || fallbackComment,
        // documentation: doc || fallbackComment,
        execute: /* @__PURE__ */ __name(async ({ context }) => {
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
__name(_OpenAPIToolset, "OpenAPIToolset");
var OpenAPIToolset = _OpenAPIToolset;

export { Integration, OpenAPIToolset };
//# sourceMappingURL=chunk-C6LZCVRN.js.map
//# sourceMappingURL=chunk-C6LZCVRN.js.map