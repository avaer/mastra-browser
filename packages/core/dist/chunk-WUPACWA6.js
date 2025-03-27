import { RegisteredLogger, createLogger } from './chunk-UAVUAO53.js';

// src/base.ts
var MastraBase = class {
  component = RegisteredLogger.LLM;
  logger;
  name;
  telemetry;
  constructor({ component, name }) {
    this.component = component || RegisteredLogger.LLM;
    this.name = name;
    this.logger = createLogger({ name: `${this.component} - ${this.name}` });
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

export { MastraBase };
