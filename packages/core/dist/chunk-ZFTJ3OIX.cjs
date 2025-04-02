'use strict';

var chunkLWKQDYNK_cjs = require('./chunk-LWKQDYNK.cjs');
var chunkXXM463NA_cjs = require('./chunk-XXM463NA.cjs');
var chunkQVQCHA2A_cjs = require('./chunk-QVQCHA2A.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/mastra/index.ts
var _Mastra_decorators, _vectors, _agents, _logger, _workflows, _tts, _serverMiddleware, _telemetry, _storage, _memory, _networks, _init;
_Mastra_decorators = [chunkXXM463NA_cjs.InstrumentClass({
  prefix: "mastra",
  excludeMethods: ["getLogger", "getTelemetry"]
})];
var _Mastra = class _Mastra {
  constructor(config) {
    chunk7D636BPD_cjs.__privateAdd(this, _vectors);
    chunk7D636BPD_cjs.__privateAdd(this, _agents);
    chunk7D636BPD_cjs.__privateAdd(this, _logger);
    chunk7D636BPD_cjs.__privateAdd(this, _workflows);
    chunk7D636BPD_cjs.__privateAdd(this, _tts);
    // #deployer?: MastraDeployer;
    chunk7D636BPD_cjs.__privateAdd(this, _serverMiddleware, []);
    chunk7D636BPD_cjs.__privateAdd(this, _telemetry);
    chunk7D636BPD_cjs.__privateAdd(this, _storage);
    chunk7D636BPD_cjs.__privateAdd(this, _memory);
    chunk7D636BPD_cjs.__privateAdd(this, _networks);
    if (config?.serverMiddleware) {
      chunk7D636BPD_cjs.__privateSet(this, _serverMiddleware, config.serverMiddleware.map(m => ({
        handler: m.handler,
        path: m.path || "/api/*"
      })));
    }
    let logger;
    if (config?.logger === false) {
      logger = chunkQVQCHA2A_cjs.noopLogger;
    } else {
      if (config?.logger) {
        logger = config.logger;
      } else {
        const levleOnEnv = process.env.NODE_ENV === "production" ? chunkQVQCHA2A_cjs.LogLevel.WARN : chunkQVQCHA2A_cjs.LogLevel.INFO;
        logger = chunkQVQCHA2A_cjs.createLogger({
          name: "Mastra",
          level: levleOnEnv
        });
      }
    }
    chunk7D636BPD_cjs.__privateSet(this, _logger, logger);
    let storage = config?.storage;
    if (!storage) {
      storage = new chunkLWKQDYNK_cjs.DefaultProxyStorage({
        config: {
          url: process.env.MASTRA_DEFAULT_STORAGE_URL || `:memory:`
        }
      });
    }
    chunk7D636BPD_cjs.__privateSet(this, _telemetry, chunkXXM463NA_cjs.Telemetry.init(config?.telemetry));
    if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
      chunk7D636BPD_cjs.__privateSet(this, _storage, chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      chunk7D636BPD_cjs.__privateGet(this, _storage).__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
    } else {
      chunk7D636BPD_cjs.__privateSet(this, _storage, storage);
    }
    if (config?.vectors) {
      let vectors = {};
      Object.entries(config.vectors).forEach(([key, vector]) => {
        if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
          vectors[key] = chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
        } else {
          vectors[key] = vector;
        }
      });
      chunk7D636BPD_cjs.__privateSet(this, _vectors, vectors);
    }
    if (config?.vectors) {
      chunk7D636BPD_cjs.__privateSet(this, _vectors, config.vectors);
    }
    if (config?.memory) {
      chunk7D636BPD_cjs.__privateSet(this, _memory, config.memory);
      if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
        chunk7D636BPD_cjs.__privateSet(this, _memory, chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(config.memory, {
          excludeMethods: ["__setTelemetry", "__getTelemetry"]
        }));
        chunk7D636BPD_cjs.__privateGet(this, _memory).__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
      }
    }
    if (config && `memory` in config) {
      chunk7D636BPD_cjs.__privateGet(this, _logger).warn(`
  Memory should be added to Agents, not to Mastra.

Instead of:
  new Mastra({ memory: new Memory() })

do:
  new Agent({ memory: new Memory() })

This is a warning for now, but will throw an error in the future
`);
    }
    if (config?.tts) {
      chunk7D636BPD_cjs.__privateSet(this, _tts, config.tts);
      Object.entries(chunk7D636BPD_cjs.__privateGet(this, _tts)).forEach(([key, ttsCl]) => {
        if (chunk7D636BPD_cjs.__privateGet(this, _tts)?.[key]) {
          if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
            chunk7D636BPD_cjs.__privateGet(this, _tts)[key] = chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(ttsCl, {
              excludeMethods: ["__setTelemetry", "__getTelemetry"]
            });
            chunk7D636BPD_cjs.__privateGet(this, _tts)[key].__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
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
          telemetry: chunk7D636BPD_cjs.__privateGet(this, _telemetry),
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: chunk7D636BPD_cjs.__privateGet(this, _tts),
          vectors: chunk7D636BPD_cjs.__privateGet(this, _vectors)
        });
        agents[key] = agent;
      });
    }
    chunk7D636BPD_cjs.__privateSet(this, _agents, agents);
    chunk7D636BPD_cjs.__privateSet(this, _networks, {});
    if (config?.networks) {
      Object.entries(config.networks).forEach(([key, network]) => {
        network.__registerMastra(this);
        chunk7D636BPD_cjs.__privateGet(this, _networks)[key] = network;
      });
    }
    chunk7D636BPD_cjs.__privateSet(this, _workflows, {});
    if (config?.workflows) {
      Object.entries(config.workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: chunk7D636BPD_cjs.__privateGet(this, _telemetry),
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: chunk7D636BPD_cjs.__privateGet(this, _tts),
          vectors: chunk7D636BPD_cjs.__privateGet(this, _vectors)
        });
        chunk7D636BPD_cjs.__privateGet(this, _workflows)[key] = workflow;
      });
    }
    this.setLogger({
      logger
    });
  }
  /**
   * @deprecated use getTelemetry() instead
   */
  get telemetry() {
    return chunk7D636BPD_cjs.__privateGet(this, _telemetry);
  }
  /**
   * @deprecated use getStorage() instead
   */
  get storage() {
    return chunk7D636BPD_cjs.__privateGet(this, _storage);
  }
  /**
   * @deprecated use getMemory() instead
   */
  get memory() {
    return chunk7D636BPD_cjs.__privateGet(this, _memory);
  }
  getAgent(name) {
    const agent = chunk7D636BPD_cjs.__privateGet(this, _agents)?.[name];
    if (!agent) {
      throw new Error(`Agent with name ${String(name)} not found`);
    }
    return chunk7D636BPD_cjs.__privateGet(this, _agents)[name];
  }
  getAgents() {
    return chunk7D636BPD_cjs.__privateGet(this, _agents);
  }
  getVector(name) {
    const vector = chunk7D636BPD_cjs.__privateGet(this, _vectors)?.[name];
    if (!vector) {
      throw new Error(`Vector with name ${String(name)} not found`);
    }
    return vector;
  }
  getVectors() {
    return chunk7D636BPD_cjs.__privateGet(this, _vectors);
  }
  // public getDeployer() {
  //   return this.#deployer;
  // }
  getWorkflow(id, {
    serialized
  } = {}) {
    const workflow = chunk7D636BPD_cjs.__privateGet(this, _workflows)?.[id];
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
      return Object.entries(chunk7D636BPD_cjs.__privateGet(this, _workflows)).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return chunk7D636BPD_cjs.__privateGet(this, _workflows);
  }
  setStorage(storage) {
    chunk7D636BPD_cjs.__privateSet(this, _storage, storage);
  }
  setLogger({
    logger
  }) {
    chunk7D636BPD_cjs.__privateSet(this, _logger, logger);
    if (chunk7D636BPD_cjs.__privateGet(this, _agents)) {
      Object.keys(chunk7D636BPD_cjs.__privateGet(this, _agents)).forEach(key => {
        chunk7D636BPD_cjs.__privateGet(this, _agents)?.[key]?.__setLogger(chunk7D636BPD_cjs.__privateGet(this, _logger));
      });
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _memory)) {
      chunk7D636BPD_cjs.__privateGet(this, _memory).__setLogger(chunk7D636BPD_cjs.__privateGet(this, _logger));
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _tts)) {
      Object.keys(chunk7D636BPD_cjs.__privateGet(this, _tts)).forEach(key => {
        chunk7D636BPD_cjs.__privateGet(this, _tts)?.[key]?.__setLogger(chunk7D636BPD_cjs.__privateGet(this, _logger));
      });
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _storage)) {
      chunk7D636BPD_cjs.__privateGet(this, _storage).__setLogger(chunk7D636BPD_cjs.__privateGet(this, _logger));
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _vectors)) {
      Object.keys(chunk7D636BPD_cjs.__privateGet(this, _vectors)).forEach(key => {
        chunk7D636BPD_cjs.__privateGet(this, _vectors)?.[key]?.__setLogger(chunk7D636BPD_cjs.__privateGet(this, _logger));
      });
    }
  }
  setTelemetry(telemetry) {
    chunk7D636BPD_cjs.__privateSet(this, _telemetry, chunkXXM463NA_cjs.Telemetry.init(telemetry));
    if (chunk7D636BPD_cjs.__privateGet(this, _agents)) {
      Object.keys(chunk7D636BPD_cjs.__privateGet(this, _agents)).forEach(key => {
        if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
          chunk7D636BPD_cjs.__privateGet(this, _agents)?.[key]?.__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
        }
      });
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _memory)) {
      chunk7D636BPD_cjs.__privateSet(this, _memory, chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(chunk7D636BPD_cjs.__privateGet(this, _memory), {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      chunk7D636BPD_cjs.__privateGet(this, _memory).__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _tts)) {
      let tts = {};
      Object.entries(chunk7D636BPD_cjs.__privateGet(this, _tts)).forEach(([key, ttsCl]) => {
        if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
          tts[key] = chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(ttsCl, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          tts[key].__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
        }
      });
      chunk7D636BPD_cjs.__privateSet(this, _tts, tts);
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _storage)) {
      chunk7D636BPD_cjs.__privateSet(this, _storage, chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(chunk7D636BPD_cjs.__privateGet(this, _storage), {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      chunk7D636BPD_cjs.__privateGet(this, _storage).__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
    }
    if (chunk7D636BPD_cjs.__privateGet(this, _vectors)) {
      let vectors = {};
      Object.entries(chunk7D636BPD_cjs.__privateGet(this, _vectors)).forEach(([key, vector]) => {
        if (chunk7D636BPD_cjs.__privateGet(this, _telemetry)) {
          vectors[key] = chunk7D636BPD_cjs.__privateGet(this, _telemetry).traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(chunk7D636BPD_cjs.__privateGet(this, _telemetry));
        }
      });
      chunk7D636BPD_cjs.__privateSet(this, _vectors, vectors);
    }
  }
  getTTS() {
    return chunk7D636BPD_cjs.__privateGet(this, _tts);
  }
  getLogger() {
    return chunk7D636BPD_cjs.__privateGet(this, _logger);
  }
  getTelemetry() {
    return chunk7D636BPD_cjs.__privateGet(this, _telemetry);
  }
  getMemory() {
    return chunk7D636BPD_cjs.__privateGet(this, _memory);
  }
  getStorage() {
    return chunk7D636BPD_cjs.__privateGet(this, _storage);
  }
  getServerMiddleware() {
    return chunk7D636BPD_cjs.__privateGet(this, _serverMiddleware);
  }
  getNetworks() {
    return Object.values(chunk7D636BPD_cjs.__privateGet(this, _networks) || {});
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
    return await chunk7D636BPD_cjs.__privateGet(this, _logger).getLogsByRunId({
      runId,
      transportId
    });
  }
  async getLogs(transportId) {
    if (!transportId) {
      throw new Error("Transport ID is required");
    }
    return await chunk7D636BPD_cjs.__privateGet(this, _logger).getLogs(transportId);
  }
};
_init = chunk7D636BPD_cjs.__decoratorStart(null);
_vectors = new WeakMap();
_agents = new WeakMap();
_logger = new WeakMap();
_workflows = new WeakMap();
_tts = new WeakMap();
_serverMiddleware = new WeakMap();
_telemetry = new WeakMap();
_storage = new WeakMap();
_memory = new WeakMap();
_Mastra = /*@__PURE__*/(_ => {
  _networks = new WeakMap();
  _Mastra = chunk7D636BPD_cjs.__decorateElement(_init, 0, "Mastra", _Mastra_decorators, _Mastra);
  chunk7D636BPD_cjs.__name(_Mastra, "Mastra");
  return _Mastra;
})();
chunk7D636BPD_cjs.__runInitializers(_init, 1, _Mastra);
var Mastra = _Mastra;

exports.Mastra = Mastra;
//# sourceMappingURL=chunk-ZFTJ3OIX.cjs.map
//# sourceMappingURL=chunk-ZFTJ3OIX.cjs.map