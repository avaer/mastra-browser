export { O as OtelConfig, S as SamplingStrategy, T as Telemetry } from '../base-Dq_cxikD.js';
import { SpanKind } from '@opentelemetry/api';
import { ExportResult } from '@opentelemetry/core';
import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { L as Logger } from '../index-BXwGr3N7.js';
import { g as MastraStorage } from '../base-hRgvGkC2.js';
import 'stream';
import 'ai';
import '../types-CwTG2XyQ.js';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.js';
import '../vector/filter/index.js';
import '../tts/index.js';

declare function withSpan(options: {
    spanName?: string;
    skipIfNoTelemetry?: boolean;
    spanKind?: SpanKind;
    tracerName?: string;
}): any;
declare function InstrumentClass(options?: {
    prefix?: string;
    spanKind?: SpanKind;
    excludeMethods?: string[];
    methodFilter?: (methodName: string) => boolean;
    tracerName?: string;
}): (target: any) => any;

declare function hasActiveTelemetry(tracerName?: string): boolean;

declare class OTLPTraceExporter implements SpanExporter {
    private storage;
    private queue;
    private serializer;
    private logger;
    private activeFlush;
    constructor({ logger, storage }: {
        logger: Logger;
        storage: MastraStorage;
    });
    export(internalRepresentation: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    shutdown(): Promise<void>;
    flush(): Promise<void>;
    forceFlush(): Promise<void>;
    __setLogger(logger: Logger): void;
}

export { InstrumentClass, OTLPTraceExporter as OTLPStorageExporter, hasActiveTelemetry, withSpan };
