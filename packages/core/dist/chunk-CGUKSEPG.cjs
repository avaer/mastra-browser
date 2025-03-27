'use strict';

var stream = require('stream');

// src/logger/index.ts
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
var LoggerTransport = class extends stream.Transform {
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
var Logger = class {
  // protected logger: pino.Logger;
  transports;
  constructor(options = {}) {
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
      transform: (chunk, _encoding, callback) => {
        const line = chunk.toString().trim();
        if (line) {
          this.info(line);
        }
        callback(null, chunk);
      }
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
function createLogger(options) {
  return new Logger(options);
}
var MultiLogger = class {
  loggers;
  constructor(loggers) {
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
function combineLoggers(loggers) {
  return new MultiLogger(loggers);
}
var noopLogger = {
  debug: () => {
  },
  info: () => {
  },
  warn: () => {
  },
  error: () => {
  },
  cleanup: async () => {
  }
};

exports.LogLevel = LogLevel;
exports.Logger = Logger;
exports.LoggerTransport = LoggerTransport;
exports.MultiLogger = MultiLogger;
exports.RegisteredLogger = RegisteredLogger;
exports.combineLoggers = combineLoggers;
exports.createLogger = createLogger;
exports.noopLogger = noopLogger;
