'use strict';

var chunkCGUKSEPG_cjs = require('./chunk-CGUKSEPG.cjs');

// src/base.ts
var MastraBase = class {
  component = chunkCGUKSEPG_cjs.RegisteredLogger.LLM;
  logger;
  name;
  telemetry;
  constructor({ component, name }) {
    this.component = component || chunkCGUKSEPG_cjs.RegisteredLogger.LLM;
    this.name = name;
    this.logger = chunkCGUKSEPG_cjs.createLogger({ name: `${this.component} - ${this.name}` });
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

exports.MastraBase = MastraBase;
