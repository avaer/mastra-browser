export { O as OtelConfig, S as SamplingStrategy, T as Telemetry } from '../base-D_N8PfP5.cjs';
import { SpanKind } from '@opentelemetry/api';
import { ExportResult } from '@opentelemetry/core';
import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { L as Logger } from '../index-BXwGr3N7.cjs';
import { g as MastraStorage } from '../base-DXu3GGXw.cjs';
import 'stream';
import 'ai';
import '../types-CwTG2XyQ.cjs';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.cjs';
import '../vector/filter/index.cjs';
import '../tts/index.cjs';

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
