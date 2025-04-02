'use strict';

var chunkJOQIBQ7H_cjs = require('./chunk-JOQIBQ7H.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var api = require('@opentelemetry/api');
var core = require('@opentelemetry/core');
var otlpTransformer = require('@opentelemetry/otlp-transformer');

function hasActiveTelemetry(tracerName = "default-tracer") {
  try {
    return !!api.trace.getTracer(tracerName);
  } catch {
    return false;
  }
}
chunk7D636BPD_cjs.__name(hasActiveTelemetry, "hasActiveTelemetry");

// src/telemetry/telemetry.decorators.ts
function withSpan(options) {
  return function(_target, propertyKey, descriptor) {
    if (!descriptor || typeof descriptor === "number") return;
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);
    descriptor.value = function(...args) {
      if (options?.skipIfNoTelemetry && !hasActiveTelemetry(options?.tracerName)) {
        return originalMethod.apply(this, args);
      }
      const tracer = api.trace.getTracer(options?.tracerName ?? "default-tracer");
      let spanName;
      let spanKind;
      if (typeof options === "string") {
        spanName = options;
      } else if (options) {
        spanName = options.spanName || methodName;
        spanKind = options.spanKind;
      } else {
        spanName = methodName;
      }
      const span = tracer.startSpan(spanName, { kind: spanKind });
      let ctx = api.trace.setSpan(api.context.active(), span);
      args.forEach((arg, index) => {
        try {
          span.setAttribute(`${spanName}.argument.${index}`, JSON.stringify(arg));
        } catch {
          span.setAttribute(`${spanName}.argument.${index}`, "[Not Serializable]");
        }
      });
      const currentBaggage = api.propagation.getBaggage(ctx);
      if (currentBaggage?.componentName) {
        span.setAttribute("componentName", currentBaggage?.componentName);
        span.setAttribute("runId", currentBaggage?.runId);
      } else if (this && this.name) {
        span.setAttribute("componentName", this.name);
        span.setAttribute("runId", this.runId);
        ctx = api.propagation.setBaggage(ctx, { componentName: this.name, runId: this.runId });
      }
      let result;
      try {
        result = api.context.with(ctx, () => originalMethod.apply(this, args));
        if (result instanceof Promise) {
          return result.then((resolvedValue) => {
            try {
              span.setAttribute(`${spanName}.result`, JSON.stringify(resolvedValue));
            } catch {
              span.setAttribute(`${spanName}.result`, "[Not Serializable]");
            }
            return resolvedValue;
          }).finally(() => span.end());
        }
        try {
          span.setAttribute(`${spanName}.result`, JSON.stringify(result));
        } catch {
          span.setAttribute(`${spanName}.result`, "[Not Serializable]");
        }
        return result;
      } catch (error) {
        span.setStatus({
          code: api.SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : "Unknown error"
        });
        if (error instanceof Error) {
          span.recordException(error);
        }
        throw error;
      } finally {
        if (!(result instanceof Promise)) {
          span.end();
        }
      }
    };
    return descriptor;
  };
}
chunk7D636BPD_cjs.__name(withSpan, "withSpan");
function InstrumentClass(options) {
  return function(target) {
    const methods = Object.getOwnPropertyNames(target.prototype);
    methods.forEach((method) => {
      if (options?.excludeMethods?.includes(method) || method === "constructor") return;
      if (options?.methodFilter && !options.methodFilter(method)) return;
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, method);
      if (descriptor && typeof descriptor.value === "function") {
        Object.defineProperty(
          target.prototype,
          method,
          withSpan({
            spanName: options?.prefix ? `${options.prefix}.${method}` : method,
            skipIfNoTelemetry: true,
            spanKind: options?.spanKind || api.SpanKind.INTERNAL,
            tracerName: options?.tracerName
          })(target, method, descriptor)
        );
      }
    });
    return target;
  };
}
chunk7D636BPD_cjs.__name(InstrumentClass, "InstrumentClass");
var _OTLPTraceExporter = class _OTLPTraceExporter {
  constructor({ logger, storage }) {
    chunk7D636BPD_cjs.__publicField(this, "storage");
    chunk7D636BPD_cjs.__publicField(this, "queue", []);
    chunk7D636BPD_cjs.__publicField(this, "serializer");
    chunk7D636BPD_cjs.__publicField(this, "logger");
    chunk7D636BPD_cjs.__publicField(this, "activeFlush");
    this.storage = storage;
    this.serializer = otlpTransformer.JsonTraceSerializer;
    this.logger = logger;
  }
  export(internalRepresentation, resultCallback) {
    const serializedRequest = this.serializer.serializeRequest(internalRepresentation);
    const payload = JSON.parse(Buffer.from(serializedRequest.buffer, "utf8"));
    const items = payload?.resourceSpans?.[0]?.scopeSpans;
    this.logger.debug(`Exporting telemetry: ${items.length} scope spans to be processed [trace batch]`);
    this.queue.push({ data: items, resultCallback });
    if (!this.activeFlush) {
      this.activeFlush = this.flush();
    }
  }
  shutdown() {
    return this.forceFlush();
  }
  flush() {
    const now = /* @__PURE__ */ new Date();
    const items = this.queue.shift();
    if (!items) return Promise.resolve();
    const allSpans = items.data.reduce((acc, scopedSpans) => {
      const { scope, spans } = scopedSpans;
      for (const span of spans) {
        const {
          spanId,
          parentSpanId,
          traceId,
          name,
          kind,
          attributes,
          status,
          events,
          links,
          startTimeUnixNano,
          endTimeUnixNano,
          ...rest
        } = span;
        const startTime = Number(BigInt(startTimeUnixNano) / 1000n);
        const endTime = Number(BigInt(endTimeUnixNano) / 1000n);
        acc.push({
          id: spanId,
          parentSpanId,
          traceId,
          name,
          scope: scope.name,
          kind,
          status: JSON.stringify(status),
          events: JSON.stringify(events),
          links: JSON.stringify(links),
          attributes: JSON.stringify(
            attributes.reduce((acc2, attr) => {
              const valueKey = Object.keys(attr.value)[0];
              if (valueKey) {
                acc2[attr.key] = attr.value[valueKey];
              }
              return acc2;
            }, {})
          ),
          startTime,
          endTime,
          other: JSON.stringify(rest),
          createdAt: now
        });
      }
      return acc;
    }, []);
    return this.storage.__batchInsert({
      tableName: chunkJOQIBQ7H_cjs.TABLE_TRACES,
      records: allSpans
    }).then(() => {
      items.resultCallback({
        code: core.ExportResultCode.SUCCESS
      });
    }).catch((e) => {
      this.logger.error("span err:" + e?.message);
      items.resultCallback({
        code: core.ExportResultCode.FAILED,
        error: e
      });
    }).finally(() => {
      this.activeFlush = void 0;
    });
  }
  async forceFlush() {
    if (!this.queue.length) {
      return;
    }
    await this.activeFlush;
    while (this.queue.length) {
      await this.flush();
    }
  }
  __setLogger(logger) {
    this.logger = logger;
  }
};
chunk7D636BPD_cjs.__name(_OTLPTraceExporter, "OTLPTraceExporter");
var OTLPTraceExporter = _OTLPTraceExporter;
var __TELEMETRY__;
var _Telemetry = class _Telemetry {
  constructor(config) {
    chunk7D636BPD_cjs.__publicField(this, "tracer", api.trace.getTracer("default"));
    chunk7D636BPD_cjs.__publicField(this, "name", "default-service");
    this.name = config.serviceName ?? "default-service";
    this.tracer = api.trace.getTracer(this.name);
  }
  /**
   * @deprecated This method does not do anything
   */
  async shutdown() {
  }
  /**
   * Initialize telemetry with the given configuration
   * @param config - Optional telemetry configuration object
   * @returns Telemetry instance that can be used for tracing
   */
  static init(config = {}) {
    try {
      if (!__TELEMETRY__) {
        __TELEMETRY__ = new _Telemetry(config);
      }
      return __TELEMETRY__;
    } catch (error) {
      console.error("Failed to initialize telemetry:", error);
      throw error;
    }
  }
  /**
   * Get the global telemetry instance
   * @throws {Error} If telemetry has not been initialized
   * @returns {Telemetry} The global telemetry instance
   */
  static get() {
    if (!__TELEMETRY__) {
      throw new Error("Telemetry not initialized");
    }
    return __TELEMETRY__;
  }
  /**
   * Wraps a class instance with telemetry tracing
   * @param instance The class instance to wrap
   * @param options Optional configuration for tracing
   * @returns Wrapped instance with all methods traced
   */
  traceClass(instance, options = {}) {
    const { skipIfNoTelemetry = true } = options;
    if (skipIfNoTelemetry && !hasActiveTelemetry()) {
      return instance;
    }
    const { spanNamePrefix = instance.constructor.name.toLowerCase(), attributes = {}, excludeMethods = [] } = options;
    return new Proxy(instance, {
      get: /* @__PURE__ */ chunk7D636BPD_cjs.__name((target, prop) => {
        const value = target[prop];
        if (typeof value === "function" && prop !== "constructor" && !prop.toString().startsWith("_") && !excludeMethods.includes(prop.toString())) {
          return this.traceMethod(value.bind(target), {
            spanName: `${spanNamePrefix}.${prop.toString()}`,
            attributes: {
              ...attributes,
              [`${spanNamePrefix}.name`]: target.constructor.name,
              [`${spanNamePrefix}.method.name`]: prop.toString()
            }
          });
        }
        return value;
      }, "get")
    });
  }
  /**
   * method to trace individual methods with proper context
   * @param method The method to trace
   * @param context Additional context for the trace
   * @returns Wrapped method with tracing
   */
  traceMethod(method, context3) {
    let ctx = api.context.active();
    const { skipIfNoTelemetry = true } = context3;
    if (skipIfNoTelemetry && !hasActiveTelemetry()) {
      return method;
    }
    return (...args) => {
      const span = this.tracer.startSpan(context3.spanName);
      function handleError(error) {
        span.recordException(error);
        span.setStatus({
          code: api.SpanStatusCode.ERROR,
          message: error.message
        });
        span.end();
        throw error;
      }
      chunk7D636BPD_cjs.__name(handleError, "handleError");
      try {
        let recordResult2 = function(res) {
          try {
            span.setAttribute(`${context3.spanName}.result`, JSON.stringify(res));
          } catch {
            span.setAttribute(`${context3.spanName}.result`, "[Not Serializable]");
          }
          span.end();
          return res;
        };
        chunk7D636BPD_cjs.__name(recordResult2, "recordResult");
        if (context3.attributes) {
          span.setAttributes(context3.attributes);
        }
        if (context3.attributes?.componentName) {
          ctx = api.propagation.setBaggage(ctx, {
            // @ts-ignore
            componentName: context3.attributes.componentName,
            runId: context3.attributes.runId
          });
        } else {
          const currentBaggage = api.propagation.getBaggage(ctx);
          if (currentBaggage?.componentName) {
            span.setAttribute("componentName", currentBaggage?.componentName);
            span.setAttribute("runId", currentBaggage?.runId);
          } else if (this && this.name) {
            span.setAttribute("componentName", this.name);
            span.setAttribute("runId", this.runId);
            ctx = api.propagation.setBaggage(ctx, { componentName: this.name, runId: this.runId });
          }
        }
        args.forEach((arg, index) => {
          try {
            span.setAttribute(`${context3.spanName}.argument.${index}`, JSON.stringify(arg));
          } catch {
            span.setAttribute(`${context3.spanName}.argument.${index}`, "[Not Serializable]");
          }
        });
        let result;
        api.context.with(api.trace.setSpan(ctx, span), () => {
          result = method(...args);
        });
        if (result instanceof Promise) {
          return result.then(recordResult2).catch(handleError);
        } else {
          return recordResult2(result);
        }
      } catch (error) {
        handleError(error);
      }
    };
  }
  getBaggageTracer() {
    return new BaggageTracer(this.tracer);
  }
};
chunk7D636BPD_cjs.__name(_Telemetry, "Telemetry");
var Telemetry = _Telemetry;
var _BaggageTracer = class _BaggageTracer {
  constructor(tracer) {
    chunk7D636BPD_cjs.__publicField(this, "_tracer");
    this._tracer = tracer;
  }
  startSpan(name, options = {}, ctx) {
    ctx = ctx ?? api.context.active();
    const span = this._tracer.startSpan(name, options, ctx);
    const currentBaggage = api.propagation.getBaggage(ctx);
    span.setAttribute("componentName", currentBaggage?.componentName);
    span.setAttribute("runId", currentBaggage?.runId);
    return span;
  }
  startActiveSpan(name, optionsOrFn, ctxOrFn, fn) {
    if (typeof optionsOrFn === "function") {
      const wrappedFn2 = /* @__PURE__ */ chunk7D636BPD_cjs.__name((span) => {
        const currentBaggage = api.propagation.getBaggage(api.context.active());
        span.setAttribute("componentName", currentBaggage?.componentName);
        return optionsOrFn(span);
      }, "wrappedFn");
      return this._tracer.startActiveSpan(name, {}, api.context.active(), wrappedFn2);
    }
    if (typeof ctxOrFn === "function") {
      const wrappedFn2 = /* @__PURE__ */ chunk7D636BPD_cjs.__name((span) => {
        const currentBaggage = api.propagation.getBaggage(api.context.active());
        span.setAttribute("componentName", currentBaggage?.componentName);
        return ctxOrFn(span);
      }, "wrappedFn");
      return this._tracer.startActiveSpan(name, optionsOrFn, api.context.active(), wrappedFn2);
    }
    const wrappedFn = /* @__PURE__ */ chunk7D636BPD_cjs.__name((span) => {
      const currentBaggage = api.propagation.getBaggage(ctxOrFn ?? api.context.active());
      span.setAttribute("componentName", currentBaggage?.componentName);
      return fn(span);
    }, "wrappedFn");
    return this._tracer.startActiveSpan(name, optionsOrFn, ctxOrFn, wrappedFn);
  }
};
chunk7D636BPD_cjs.__name(_BaggageTracer, "BaggageTracer");
var BaggageTracer = _BaggageTracer;

exports.InstrumentClass = InstrumentClass;
exports.OTLPTraceExporter = OTLPTraceExporter;
exports.Telemetry = Telemetry;
exports.hasActiveTelemetry = hasActiveTelemetry;
exports.withSpan = withSpan;
//# sourceMappingURL=chunk-XXM463NA.cjs.map
//# sourceMappingURL=chunk-XXM463NA.cjs.map