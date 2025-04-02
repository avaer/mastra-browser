'use strict';

var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var stream = require('stream');

var RegisteredLogger = {
  AGENT: "AGENT",
  NETWORK: "NETWORK",
  WORKFLOW: "WORKFLOW",
  LLM: "LLM",
  TTS: "TTS",
  VOICE: "VOICE",
  VECTOR: "VECTOR",
  BUNDLER: "BUNDLER",
  DEPLOYER: "DEPLOYER",
  MEMORY: "MEMORY",
  STORAGE: "STORAGE",
  EMBEDDINGS: "EMBEDDINGS"
};
var LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  NONE: "silent"
};
var _LoggerTransport = class _LoggerTransport extends stream.Transform {
  constructor(opts = {}) {
    super({ ...opts, objectMode: true });
  }
  async getLogsByRunId(_args) {
    return [];
  }
  async getLogs() {
    return [];
  }
};
chunk7D636BPD_cjs.__name(_LoggerTransport, "LoggerTransport");
var LoggerTransport = _LoggerTransport;
var _Logger = class _Logger {
  constructor(options = {}) {
    // protected logger: pino.Logger;
    chunk7D636BPD_cjs.__publicField(this, "transports");
    this.transports = options.transports || {};
  }
  debug(message, args = {}) {
    console.debug(args, message);
  }
  info(message, args = {}) {
    console.info(args, message);
  }
  warn(message, args = {}) {
    console.warn(args, message);
  }
  error(message, args = {}) {
    console.error(args, message);
  }
  // Stream creation for process output handling
  createStream() {
    return new stream.Transform({
      transform: /* @__PURE__ */ chunk7D636BPD_cjs.__name((chunk, _encoding, callback) => {
        const line = chunk.toString().trim();
        if (line) {
          this.info(line);
        }
        callback(null, chunk);
      }, "transform")
    });
  }
  async getLogs(transportId) {
    if (!transportId || !this.transports[transportId]) {
      return [];
    }
    return this.transports[transportId].getLogs();
  }
  async getLogsByRunId({ runId, transportId }) {
    return this.transports[transportId]?.getLogsByRunId({ runId });
  }
};
chunk7D636BPD_cjs.__name(_Logger, "Logger");
var Logger = _Logger;
function createLogger(options) {
  return new Logger(options);
}
chunk7D636BPD_cjs.__name(createLogger, "createLogger");
var _MultiLogger = class _MultiLogger {
  constructor(loggers) {
    chunk7D636BPD_cjs.__publicField(this, "loggers");
    this.loggers = loggers;
  }
  debug(message, ...args) {
    this.loggers.forEach((logger) => logger.debug(message, ...args));
  }
  info(message, ...args) {
    this.loggers.forEach((logger) => logger.info(message, ...args));
  }
  warn(message, ...args) {
    this.loggers.forEach((logger) => logger.warn(message, ...args));
  }
  error(message, ...args) {
    this.loggers.forEach((logger) => logger.error(message, ...args));
  }
};
chunk7D636BPD_cjs.__name(_MultiLogger, "MultiLogger");
var MultiLogger = _MultiLogger;
function combineLoggers(loggers) {
  return new MultiLogger(loggers);
}
chunk7D636BPD_cjs.__name(combineLoggers, "combineLoggers");
var noopLogger = {
  debug: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
  }, "debug"),
  info: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
  }, "info"),
  warn: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
  }, "warn"),
  error: /* @__PURE__ */ chunk7D636BPD_cjs.__name(() => {
  }, "error"),
  cleanup: /* @__PURE__ */ chunk7D636BPD_cjs.__name(async () => {
  }, "cleanup")
};

exports.LogLevel = LogLevel;
exports.Logger = Logger;
exports.LoggerTransport = LoggerTransport;
exports.MultiLogger = MultiLogger;
exports.RegisteredLogger = RegisteredLogger;
exports.combineLoggers = combineLoggers;
exports.createLogger = createLogger;
exports.noopLogger = noopLogger;
//# sourceMappingURL=chunk-QVQCHA2A.cjs.map
//# sourceMappingURL=chunk-QVQCHA2A.cjs.map