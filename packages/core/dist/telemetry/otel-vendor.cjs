'use strict';

var sdkNode = require('@opentelemetry/sdk-node');
var sdkTraceNode = require('@opentelemetry/sdk-trace-node');
var autoInstrumentationsNode = require('@opentelemetry/auto-instrumentations-node');
var semanticConventions = require('@opentelemetry/semantic-conventions');
var resources = require('@opentelemetry/resources');
var exporterTraceOtlpHttp = require('@opentelemetry/exporter-trace-otlp-http');
var exporterTraceOtlpGrpc = require('@opentelemetry/exporter-trace-otlp-grpc');
var sdkTraceBase = require('@opentelemetry/sdk-trace-base');



Object.defineProperty(exports, "NodeSDK", {
  enumerable: true,
  get: function () { return sdkNode.NodeSDK; }
});
Object.defineProperty(exports, "ConsoleSpanExporter", {
  enumerable: true,
  get: function () { return sdkTraceNode.ConsoleSpanExporter; }
});
Object.defineProperty(exports, "getNodeAutoInstrumentations", {
  enumerable: true,
  get: function () { return autoInstrumentationsNode.getNodeAutoInstrumentations; }
});
Object.defineProperty(exports, "ATTR_SERVICE_NAME", {
  enumerable: true,
  get: function () { return semanticConventions.ATTR_SERVICE_NAME; }
});
Object.defineProperty(exports, "Resource", {
  enumerable: true,
  get: function () { return resources.Resource; }
});
Object.defineProperty(exports, "OTLPHttpExporter", {
  enumerable: true,
  get: function () { return exporterTraceOtlpHttp.OTLPTraceExporter; }
});
Object.defineProperty(exports, "OTLPGrpcExporter", {
  enumerable: true,
  get: function () { return exporterTraceOtlpGrpc.OTLPTraceExporter; }
});
Object.defineProperty(exports, "AlwaysOffSampler", {
  enumerable: true,
  get: function () { return sdkTraceBase.AlwaysOffSampler; }
});
Object.defineProperty(exports, "AlwaysOnSampler", {
  enumerable: true,
  get: function () { return sdkTraceBase.AlwaysOnSampler; }
});
Object.defineProperty(exports, "ParentBasedSampler", {
  enumerable: true,
  get: function () { return sdkTraceBase.ParentBasedSampler; }
});
Object.defineProperty(exports, "TraceIdRatioBasedSampler", {
  enumerable: true,
  get: function () { return sdkTraceBase.TraceIdRatioBasedSampler; }
});
