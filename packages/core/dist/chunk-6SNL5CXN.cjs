'use strict';

var chunkS4RZ7LUX_cjs = require('./chunk-S4RZ7LUX.cjs');
var chunkEDBJG533_cjs = require('./chunk-EDBJG533.cjs');
var chunkCGUKSEPG_cjs = require('./chunk-CGUKSEPG.cjs');
var chunkRWTSGWWL_cjs = require('./chunk-RWTSGWWL.cjs');

// src/mastra/index.ts
var _Mastra_decorators, _init;
_Mastra_decorators = [chunkEDBJG533_cjs.InstrumentClass({
  prefix: "mastra",
  excludeMethods: ["getLogger", "getTelemetry"]
})];
exports.Mastra = class Mastra {
  #vectors;
  #agents;
  #logger;
  #workflows;
  #tts;
  #deployer;
  #serverMiddleware = [];
  #telemetry;
  #storage;
  #memory;
  #networks;
  /**
   * @deprecated use getTelemetry() instead
   */
  get telemetry() {
    return this.#telemetry;
  }
  /**
   * @deprecated use getStorage() instead
   */
  get storage() {
    return this.#storage;
  }
  /**
   * @deprecated use getMemory() instead
   */
  get memory() {
    return this.#memory;
  }
  constructor(config) {
    if (config?.serverMiddleware) {
      this.#serverMiddleware = config.serverMiddleware.map(m => ({
        handler: m.handler,
        path: m.path || "/api/*"
      }));
    }
    let logger;
    if (config?.logger === false) {
      logger = chunkCGUKSEPG_cjs.noopLogger;
    } else {
      if (config?.logger) {
        logger = config.logger;
      } else {
        const levleOnEnv = process.env.NODE_ENV === "production" ? chunkCGUKSEPG_cjs.LogLevel.WARN : chunkCGUKSEPG_cjs.LogLevel.INFO;
        logger = chunkCGUKSEPG_cjs.createLogger({
          name: "Mastra",
          level: levleOnEnv
        });
      }
    }
    this.#logger = logger;
    let storage = config?.storage;
    if (!storage) {
      storage = new chunkS4RZ7LUX_cjs.DefaultProxyStorage({
        config: {
          url: process.env.MASTRA_DEFAULT_STORAGE_URL || `:memory:`
        }
      });
    }
    this.#telemetry = chunkEDBJG533_cjs.Telemetry.init(config?.telemetry);
    if (this.#telemetry) {
      this.#storage = this.#telemetry.traceClass(storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#storage.__setTelemetry(this.#telemetry);
    } else {
      this.#storage = storage;
    }
    if (config?.vectors) {
      let vectors = {};
      Object.entries(config.vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(this.#telemetry);
        } else {
          vectors[key] = vector;
        }
      });
      this.#vectors = vectors;
    }
    if (config?.vectors) {
      this.#vectors = config.vectors;
    }
    if (config?.memory) {
      this.#memory = config.memory;
      if (this.#telemetry) {
        this.#memory = this.#telemetry.traceClass(config.memory, {
          excludeMethods: ["__setTelemetry", "__getTelemetry"]
        });
        this.#memory.__setTelemetry(this.#telemetry);
      }
    }
    if (config && `memory` in config) {
      this.#logger.warn(`
  Memory should be added to Agents, not to Mastra.

Instead of:
  new Mastra({ memory: new Memory() })

do:
  new Agent({ memory: new Memory() })

This is a warning for now, but will throw an error in the future
`);
    }
    if (config?.tts) {
      this.#tts = config.tts;
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#tts?.[key]) {
          if (this.#telemetry) {
            this.#tts[key] = this.#telemetry.traceClass(ttsCl, {
              excludeMethods: ["__setTelemetry", "__getTelemetry"]
            });
            this.#tts[key].__setTelemetry(this.#telemetry);
          }
        }
      });
    }
    const agents = {};
    if (config?.agents) {
      Object.entries(config.agents).forEach(([key, agent]) => {
        if (agents[key]) {
          throw new Error(`Agent with name ID:${key} already exists`);
        }
        agent.__registerMastra(this);
        agent.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: this.#tts,
          vectors: this.#vectors
        });
        agents[key] = agent;
      });
    }
    this.#agents = agents;
    this.#networks = {};
    if (config?.networks) {
      Object.entries(config.networks).forEach(([key, network]) => {
        network.__registerMastra(this);
        this.#networks[key] = network;
      });
    }
    this.#workflows = {};
    if (config?.workflows) {
      Object.entries(config.workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: this.#telemetry,
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: this.#tts,
          vectors: this.#vectors
        });
        this.#workflows[key] = workflow;
      });
    }
    this.setLogger({
      logger
    });
  }
  getAgent(name) {
    const agent = this.#agents?.[name];
    if (!agent) {
      throw new Error(`Agent with name ${String(name)} not found`);
    }
    return this.#agents[name];
  }
  getAgents() {
    return this.#agents;
  }
  getVector(name) {
    const vector = this.#vectors?.[name];
    if (!vector) {
      throw new Error(`Vector with name ${String(name)} not found`);
    }
    return vector;
  }
  getVectors() {
    return this.#vectors;
  }
  getDeployer() {
    return this.#deployer;
  }
  getWorkflow(id, {
    serialized
  } = {}) {
    const workflow = this.#workflows?.[id];
    if (!workflow) {
      throw new Error(`Workflow with ID ${String(id)} not found`);
    }
    if (serialized) {
      return {
        name: workflow.name
      };
    }
    return workflow;
  }
  getWorkflows(props = {}) {
    if (props.serialized) {
      return Object.entries(this.#workflows).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return this.#workflows;
  }
  setStorage(storage) {
    this.#storage = storage;
  }
  setLogger({
    logger
  }) {
    this.#logger = logger;
    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        this.#agents?.[key]?.__setLogger(this.#logger);
      });
    }
    if (this.#memory) {
      this.#memory.__setLogger(this.#logger);
    }
    if (this.#deployer) {
      this.#deployer.__setLogger(this.#logger);
    }
    if (this.#tts) {
      Object.keys(this.#tts).forEach(key => {
        this.#tts?.[key]?.__setLogger(this.#logger);
      });
    }
    if (this.#storage) {
      this.#storage.__setLogger(this.#logger);
    }
    if (this.#vectors) {
      Object.keys(this.#vectors).forEach(key => {
        this.#vectors?.[key]?.__setLogger(this.#logger);
      });
    }
  }
  setTelemetry(telemetry) {
    this.#telemetry = chunkEDBJG533_cjs.Telemetry.init(telemetry);
    if (this.#agents) {
      Object.keys(this.#agents).forEach(key => {
        if (this.#telemetry) {
          this.#agents?.[key]?.__setTelemetry(this.#telemetry);
        }
      });
    }
    if (this.#memory) {
      this.#memory = this.#telemetry.traceClass(this.#memory, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#memory.__setTelemetry(this.#telemetry);
    }
    if (this.#deployer) {
      this.#deployer = this.#telemetry.traceClass(this.#deployer, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#deployer.__setTelemetry(this.#telemetry);
    }
    if (this.#tts) {
      let tts = {};
      Object.entries(this.#tts).forEach(([key, ttsCl]) => {
        if (this.#telemetry) {
          tts[key] = this.#telemetry.traceClass(ttsCl, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          tts[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#tts = tts;
    }
    if (this.#storage) {
      this.#storage = this.#telemetry.traceClass(this.#storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      });
      this.#storage.__setTelemetry(this.#telemetry);
    }
    if (this.#vectors) {
      let vectors = {};
      Object.entries(this.#vectors).forEach(([key, vector]) => {
        if (this.#telemetry) {
          vectors[key] = this.#telemetry.traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(this.#telemetry);
        }
      });
      this.#vectors = vectors;
    }
  }
  getTTS() {
    return this.#tts;
  }
  getLogger() {
    return this.#logger;
  }
  getTelemetry() {
    return this.#telemetry;
  }
  getMemory() {
    return this.#memory;
  }
  getStorage() {
    return this.#storage;
  }
  getServerMiddleware() {
    return this.#serverMiddleware;
  }
  getNetworks() {
    return Object.values(this.#networks || {});
  }
  /**
   * Get a specific network by ID
   * @param networkId - The ID of the network to retrieve
   * @returns The network with the specified ID, or undefined if not found
   */
  getNetwork(networkId) {
    const networks = this.getNetworks();
    return networks.find(network => {
      const routingAgent = network.getRoutingAgent();
      return network.formatAgentId(routingAgent.name) === networkId;
    });
  }
  async getLogsByRunId({
    runId,
    transportId
  }) {
    if (!transportId) {
      throw new Error("Transport ID is required");
    }
    return await this.#logger.getLogsByRunId({
      runId,
      transportId
    });
  }
  async getLogs(transportId) {
    if (!transportId) {
      throw new Error("Transport ID is required");
    }
    return await this.#logger.getLogs(transportId);
  }
};
exports.Mastra = /*@__PURE__*/(_ => {
  _init = chunkRWTSGWWL_cjs.__decoratorStart(null);
  exports.Mastra = chunkRWTSGWWL_cjs.__decorateElement(_init, 0, "Mastra", _Mastra_decorators, exports.Mastra);
  chunkRWTSGWWL_cjs.__runInitializers(_init, 1, exports.Mastra);
  return exports.Mastra;
})();
