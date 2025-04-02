import { DefaultProxyStorage } from './chunk-B54FHTIL.js';
import { InstrumentClass, Telemetry } from './chunk-GCXZG37R.js';
import { createLogger, LogLevel, noopLogger } from './chunk-HEAZ5SGJ.js';
import { __decoratorStart, __runInitializers, __privateAdd, __privateSet, __privateGet, __decorateElement, __name } from './chunk-WH5OY6PO.js';

// src/mastra/index.ts
var _Mastra_decorators, _vectors, _agents, _logger, _workflows, _tts, _serverMiddleware, _telemetry, _storage, _memory, _networks, _init;
_Mastra_decorators = [InstrumentClass({
  prefix: "mastra",
  excludeMethods: ["getLogger", "getTelemetry"]
})];
var _Mastra = class _Mastra {
  constructor(config) {
    __privateAdd(this, _vectors);
    __privateAdd(this, _agents);
    __privateAdd(this, _logger);
    __privateAdd(this, _workflows);
    __privateAdd(this, _tts);
    // #deployer?: MastraDeployer;
    __privateAdd(this, _serverMiddleware, []);
    __privateAdd(this, _telemetry);
    __privateAdd(this, _storage);
    __privateAdd(this, _memory);
    __privateAdd(this, _networks);
    if (config?.serverMiddleware) {
      __privateSet(this, _serverMiddleware, config.serverMiddleware.map(m => ({
        handler: m.handler,
        path: m.path || "/api/*"
      })));
    }
    let logger;
    if (config?.logger === false) {
      logger = noopLogger;
    } else {
      if (config?.logger) {
        logger = config.logger;
      } else {
        const levleOnEnv = process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.INFO;
        logger = createLogger({
          name: "Mastra",
          level: levleOnEnv
        });
      }
    }
    __privateSet(this, _logger, logger);
    let storage = config?.storage;
    if (!storage) {
      storage = new DefaultProxyStorage({
        config: {
          url: process.env.MASTRA_DEFAULT_STORAGE_URL || `:memory:`
        }
      });
    }
    __privateSet(this, _telemetry, Telemetry.init(config?.telemetry));
    if (__privateGet(this, _telemetry)) {
      __privateSet(this, _storage, __privateGet(this, _telemetry).traceClass(storage, {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      __privateGet(this, _storage).__setTelemetry(__privateGet(this, _telemetry));
    } else {
      __privateSet(this, _storage, storage);
    }
    if (config?.vectors) {
      let vectors = {};
      Object.entries(config.vectors).forEach(([key, vector]) => {
        if (__privateGet(this, _telemetry)) {
          vectors[key] = __privateGet(this, _telemetry).traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(__privateGet(this, _telemetry));
        } else {
          vectors[key] = vector;
        }
      });
      __privateSet(this, _vectors, vectors);
    }
    if (config?.vectors) {
      __privateSet(this, _vectors, config.vectors);
    }
    if (config?.memory) {
      __privateSet(this, _memory, config.memory);
      if (__privateGet(this, _telemetry)) {
        __privateSet(this, _memory, __privateGet(this, _telemetry).traceClass(config.memory, {
          excludeMethods: ["__setTelemetry", "__getTelemetry"]
        }));
        __privateGet(this, _memory).__setTelemetry(__privateGet(this, _telemetry));
      }
    }
    if (config && `memory` in config) {
      __privateGet(this, _logger).warn(`
  Memory should be added to Agents, not to Mastra.

Instead of:
  new Mastra({ memory: new Memory() })

do:
  new Agent({ memory: new Memory() })

This is a warning for now, but will throw an error in the future
`);
    }
    if (config?.tts) {
      __privateSet(this, _tts, config.tts);
      Object.entries(__privateGet(this, _tts)).forEach(([key, ttsCl]) => {
        if (__privateGet(this, _tts)?.[key]) {
          if (__privateGet(this, _telemetry)) {
            __privateGet(this, _tts)[key] = __privateGet(this, _telemetry).traceClass(ttsCl, {
              excludeMethods: ["__setTelemetry", "__getTelemetry"]
            });
            __privateGet(this, _tts)[key].__setTelemetry(__privateGet(this, _telemetry));
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
          telemetry: __privateGet(this, _telemetry),
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: __privateGet(this, _tts),
          vectors: __privateGet(this, _vectors)
        });
        agents[key] = agent;
      });
    }
    __privateSet(this, _agents, agents);
    __privateSet(this, _networks, {});
    if (config?.networks) {
      Object.entries(config.networks).forEach(([key, network]) => {
        network.__registerMastra(this);
        __privateGet(this, _networks)[key] = network;
      });
    }
    __privateSet(this, _workflows, {});
    if (config?.workflows) {
      Object.entries(config.workflows).forEach(([key, workflow]) => {
        workflow.__registerMastra(this);
        workflow.__registerPrimitives({
          logger: this.getLogger(),
          telemetry: __privateGet(this, _telemetry),
          storage: this.storage,
          memory: this.memory,
          agents,
          tts: __privateGet(this, _tts),
          vectors: __privateGet(this, _vectors)
        });
        __privateGet(this, _workflows)[key] = workflow;
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
    return __privateGet(this, _telemetry);
  }
  /**
   * @deprecated use getStorage() instead
   */
  get storage() {
    return __privateGet(this, _storage);
  }
  /**
   * @deprecated use getMemory() instead
   */
  get memory() {
    return __privateGet(this, _memory);
  }
  getAgent(name) {
    const agent = __privateGet(this, _agents)?.[name];
    if (!agent) {
      throw new Error(`Agent with name ${String(name)} not found`);
    }
    return __privateGet(this, _agents)[name];
  }
  getAgents() {
    return __privateGet(this, _agents);
  }
  getVector(name) {
    const vector = __privateGet(this, _vectors)?.[name];
    if (!vector) {
      throw new Error(`Vector with name ${String(name)} not found`);
    }
    return vector;
  }
  getVectors() {
    return __privateGet(this, _vectors);
  }
  // public getDeployer() {
  //   return this.#deployer;
  // }
  getWorkflow(id, {
    serialized
  } = {}) {
    const workflow = __privateGet(this, _workflows)?.[id];
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
      return Object.entries(__privateGet(this, _workflows)).reduce((acc, [k, v]) => {
        return {
          ...acc,
          [k]: {
            name: v.name
          }
        };
      }, {});
    }
    return __privateGet(this, _workflows);
  }
  setStorage(storage) {
    __privateSet(this, _storage, storage);
  }
  setLogger({
    logger
  }) {
    __privateSet(this, _logger, logger);
    if (__privateGet(this, _agents)) {
      Object.keys(__privateGet(this, _agents)).forEach(key => {
        __privateGet(this, _agents)?.[key]?.__setLogger(__privateGet(this, _logger));
      });
    }
    if (__privateGet(this, _memory)) {
      __privateGet(this, _memory).__setLogger(__privateGet(this, _logger));
    }
    if (__privateGet(this, _tts)) {
      Object.keys(__privateGet(this, _tts)).forEach(key => {
        __privateGet(this, _tts)?.[key]?.__setLogger(__privateGet(this, _logger));
      });
    }
    if (__privateGet(this, _storage)) {
      __privateGet(this, _storage).__setLogger(__privateGet(this, _logger));
    }
    if (__privateGet(this, _vectors)) {
      Object.keys(__privateGet(this, _vectors)).forEach(key => {
        __privateGet(this, _vectors)?.[key]?.__setLogger(__privateGet(this, _logger));
      });
    }
  }
  setTelemetry(telemetry) {
    __privateSet(this, _telemetry, Telemetry.init(telemetry));
    if (__privateGet(this, _agents)) {
      Object.keys(__privateGet(this, _agents)).forEach(key => {
        if (__privateGet(this, _telemetry)) {
          __privateGet(this, _agents)?.[key]?.__setTelemetry(__privateGet(this, _telemetry));
        }
      });
    }
    if (__privateGet(this, _memory)) {
      __privateSet(this, _memory, __privateGet(this, _telemetry).traceClass(__privateGet(this, _memory), {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      __privateGet(this, _memory).__setTelemetry(__privateGet(this, _telemetry));
    }
    if (__privateGet(this, _tts)) {
      let tts = {};
      Object.entries(__privateGet(this, _tts)).forEach(([key, ttsCl]) => {
        if (__privateGet(this, _telemetry)) {
          tts[key] = __privateGet(this, _telemetry).traceClass(ttsCl, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          tts[key].__setTelemetry(__privateGet(this, _telemetry));
        }
      });
      __privateSet(this, _tts, tts);
    }
    if (__privateGet(this, _storage)) {
      __privateSet(this, _storage, __privateGet(this, _telemetry).traceClass(__privateGet(this, _storage), {
        excludeMethods: ["__setTelemetry", "__getTelemetry"]
      }));
      __privateGet(this, _storage).__setTelemetry(__privateGet(this, _telemetry));
    }
    if (__privateGet(this, _vectors)) {
      let vectors = {};
      Object.entries(__privateGet(this, _vectors)).forEach(([key, vector]) => {
        if (__privateGet(this, _telemetry)) {
          vectors[key] = __privateGet(this, _telemetry).traceClass(vector, {
            excludeMethods: ["__setTelemetry", "__getTelemetry"]
          });
          vectors[key].__setTelemetry(__privateGet(this, _telemetry));
        }
      });
      __privateSet(this, _vectors, vectors);
    }
  }
  getTTS() {
    return __privateGet(this, _tts);
  }
  getLogger() {
    return __privateGet(this, _logger);
  }
  getTelemetry() {
    return __privateGet(this, _telemetry);
  }
  getMemory() {
    return __privateGet(this, _memory);
  }
  getStorage() {
    return __privateGet(this, _storage);
  }
  getServerMiddleware() {
    return __privateGet(this, _serverMiddleware);
  }
  getNetworks() {
    return Object.values(__privateGet(this, _networks) || {});
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
    return await __privateGet(this, _logger).getLogsByRunId({
      runId,
      transportId
    });
  }
  async getLogs(transportId) {
    if (!transportId) {
      throw new Error("Transport ID is required");
    }
    return await __privateGet(this, _logger).getLogs(transportId);
  }
};
_init = __decoratorStart(null);
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
  _Mastra = __decorateElement(_init, 0, "Mastra", _Mastra_decorators, _Mastra);
  __name(_Mastra, "Mastra");
  return _Mastra;
})();
__runInitializers(_init, 1, _Mastra);
var Mastra = _Mastra;

export { Mastra };
//# sourceMappingURL=chunk-NFJM46I3.js.map
//# sourceMappingURL=chunk-NFJM46I3.js.map