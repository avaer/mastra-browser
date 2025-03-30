'use strict';

var base = require('@mastra/core/base');
var tools = require('@mastra/core/tools');
var utils = require('@mastra/core/utils');
var index_js = require('@modelcontextprotocol/sdk/client/index.js');
var sse_js = require('@modelcontextprotocol/sdk/client/sse.js');
var protocol_js = require('@modelcontextprotocol/sdk/shared/protocol.js');
var types_js = require('@modelcontextprotocol/sdk/types.js');
var uuid = require('uuid');

// src/client.ts
var MastraMCPClient = class extends base.MastraBase {
  name;
  transport;
  client;
  timeout;
  constructor({
    name,
    version = "1.0.0",
    server,
    capabilities = {},
    timeout = protocol_js.DEFAULT_REQUEST_TIMEOUT_MSEC
  }) {
    super({ name: "MastraMCPClient" });
    this.name = name;
    this.timeout = timeout;
    if (`url` in server) {
      this.transport = new sse_js.SSEClientTransport(server.url, {
        requestInit: server.requestInit,
        eventSourceInit: server.eventSourceInit
      });
    } else {
      this.transport = null;
    }
    this.client = new index_js.Client(
      {
        name,
        version
      },
      {
        capabilities
      }
    );
  }
  isConnected = false;
  async connect() {
    if (this.isConnected) return;
    try {
      await this.client.connect(this.transport);
      this.isConnected = true;
      const originalOnClose = this.client.onclose;
      this.client.onclose = () => {
        this.isConnected = false;
        if (typeof originalOnClose === `function`) {
          originalOnClose();
        }
      };
    } catch (e) {
      this.logger.error(
        `Failed connecting to MCPClient with name ${this.name}.
${e instanceof Error ? e.stack : JSON.stringify(e, null, 2)}`
      );
      this.isConnected = false;
      throw e;
    }
  }
  async disconnect() {
    return await this.client.close();
  }
  // TODO: do the type magic to return the right method type. Right now we get infinitely deep infered type errors from Zod without using "any"
  async resources() {
    return await this.client.request({ method: "resources/list" }, types_js.ListResourcesResultSchema);
  }
  async tools() {
    const { tools: tools$1 } = await this.client.listTools();
    const toolsRes = {};
    tools$1.forEach((tool) => {
      const s = utils.jsonSchemaToModel(tool.inputSchema);
      const mastraTool = tools.createTool({
        id: `${this.name}_${tool.name}`,
        description: tool.description || "",
        inputSchema: s,
        execute: async ({ context }) => {
          try {
            const res = await this.client.callTool(
              {
                name: tool.name,
                arguments: context
              },
              types_js.CallToolResultSchema,
              {
                timeout: this.timeout
              }
            );
            return res;
          } catch (e) {
            console.log("Error calling tool", tool.name);
            console.error(e);
            throw e;
          }
        }
      });
      if (tool.name) {
        toolsRes[tool.name] = mastraTool;
      }
    });
    return toolsRes;
  }
};
var mastraMCPConfigurationInstances = /* @__PURE__ */ new Map();
var MCPConfiguration = class extends base.MastraBase {
  serverConfigs = {};
  id;
  constructor(args) {
    super({ name: "MCPConfiguration" });
    this.serverConfigs = args.servers;
    this.id = args.id ?? this.makeId();
    const existingInstance = mastraMCPConfigurationInstances.get(this.id);
    if (existingInstance) {
      if (!args.id) {
        throw new Error(`MCPConfiguration was initialized multiple times with the same configuration options.

This error is intended to prevent memory leaks.

To fix this you have three different options:
1. If you need multiple MCPConfiguration class instances with identical server configurations, set an id when configuring: new MCPConfiguration({ id: "my-unique-id" })
2. Call "await configuration.disconnect()" after you're done using the configuration and before you recreate another instance with the same options. If the identical MCPConfiguration instance is already closed at the time of re-creating it, you will not see this error.
3. If you only need one instance of MCPConfiguration in your app, refactor your code so it's only created one time (ex. move it out of a loop into a higher scope code block)
`);
      }
      return existingInstance;
    }
    this.addToInstanceCache();
    return this;
  }
  addToInstanceCache() {
    if (!mastraMCPConfigurationInstances.has(this.id)) {
      mastraMCPConfigurationInstances.set(this.id, this);
    }
  }
  makeId() {
    const text = JSON.stringify(this.serverConfigs).normalize("NFKC");
    const idNamespace = uuid.v5(`MCPConfiguration`, uuid.v5.DNS);
    return uuid.v5(text, idNamespace);
  }
  async disconnect() {
    mastraMCPConfigurationInstances.delete(this.id);
    for (const serverName of Object.keys(this.serverConfigs)) {
      const client = this.mcpClientsById.get(serverName);
      if (client) {
        await client.disconnect();
      }
    }
  }
  async getTools() {
    this.addToInstanceCache();
    const connectedTools = {};
    await this.eachClientTools(async ({ serverName, tools }) => {
      for (const [toolName, toolConfig] of Object.entries(tools)) {
        connectedTools[`${serverName}_${toolName}`] = toolConfig;
      }
    });
    return connectedTools;
  }
  async getToolsets() {
    this.addToInstanceCache();
    const connectedToolsets = {};
    await this.eachClientTools(async ({ serverName, tools }) => {
      if (tools) {
        connectedToolsets[serverName] = tools;
      }
    });
    return connectedToolsets;
  }
  mcpClientsById = /* @__PURE__ */ new Map();
  async getConnectedClient(name, config) {
    const exists = this.mcpClientsById.has(name);
    if (exists) {
      const mcpClient2 = this.mcpClientsById.get(name);
      await mcpClient2.connect();
      return mcpClient2;
    }
    this.logger.debug(`Connecting to ${name} MCP server`);
    const mcpClient = new MastraMCPClient({
      name,
      server: config
    });
    this.mcpClientsById.set(name, mcpClient);
    try {
      await mcpClient.connect();
    } catch (e) {
      this.mcpClientsById.delete(name);
      this.logger.error(`MCPConfiguration errored connecting to MCP server ${name}`);
      throw e;
    }
    this.logger.debug(`Connected to ${name} MCP server`);
    return mcpClient;
  }
  async eachClientTools(cb) {
    for (const [serverName, serverConfig] of Object.entries(this.serverConfigs)) {
      const client = await this.getConnectedClient(serverName, serverConfig);
      const tools = await client.tools();
      await cb({
        serverName,
        tools,
        client
      });
    }
  }
};

exports.MCPConfiguration = MCPConfiguration;
exports.MastraMCPClient = MastraMCPClient;
