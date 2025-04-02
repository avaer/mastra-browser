'use strict';

var chunkQVQCHA2A_cjs = require('./chunk-QVQCHA2A.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/base.ts
var _MastraBase = class _MastraBase {
  constructor({ component, name }) {
    chunk7D636BPD_cjs.__publicField(this, "component", chunkQVQCHA2A_cjs.RegisteredLogger.LLM);
    chunk7D636BPD_cjs.__publicField(this, "logger");
    chunk7D636BPD_cjs.__publicField(this, "name");
    chunk7D636BPD_cjs.__publicField(this, "telemetry");
    this.component = component || chunkQVQCHA2A_cjs.RegisteredLogger.LLM;
    this.name = name;
    this.logger = chunkQVQCHA2A_cjs.createLogger({ name: `${this.component} - ${this.name}` });
  }
  /**
   * Set the logger for the agent
   * @param logger
   */
  __setLogger(logger) {
    this.logger = logger;
    this.logger.debug(`Logger updated [component=${this.component}] [name=${this.name}]`);
  }
  /**
   * Set the telemetry for the
   * @param telemetry
   */
  __setTelemetry(telemetry) {
    this.telemetry = telemetry;
    this.logger.debug(`Telemetry updated [component=${this.component}] [tracer=${this.telemetry.tracer}]`);
  }
  /**
   * Get the telemetry on the vector
   * @returns telemetry
   */
  __getTelemetry() {
    return this.telemetry;
  }
  /* 
    get experimental_telemetry config
    */
  get experimental_telemetry() {
    return this.telemetry ? {
      // tracer: this.telemetry.tracer,
      tracer: this.telemetry.getBaggageTracer(),
      isEnabled: !!this.telemetry.tracer
    } : void 0;
  }
};
chunk7D636BPD_cjs.__name(_MastraBase, "MastraBase");
var MastraBase = _MastraBase;

exports.MastraBase = MastraBase;
//# sourceMappingURL=chunk-SUWCCDLE.cjs.map
//# sourceMappingURL=chunk-SUWCCDLE.cjs.map