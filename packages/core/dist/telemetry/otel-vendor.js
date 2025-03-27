export { NodeSDK } from '@opentelemetry/sdk-node';
export { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
export { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
export { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
export { Resource } from '@opentelemetry/resources';
export { OTLPTraceExporter as OTLPHttpExporter } from '@opentelemetry/exporter-trace-otlp-http';
export { OTLPTraceExporter as OTLPGrpcExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
export { AlwaysOffSampler, AlwaysOnSampler, ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
