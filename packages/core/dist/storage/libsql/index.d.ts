import { g as MastraStorage, h as TABLE_NAMES, i as StorageColumn, j as StorageThreadType, k as MessageType, l as StorageGetMessagesArg, E as EvalRow } from '../../base-hRgvGkC2.js';
import 'ai';
import '../../base-Dq_cxikD.js';
import '@opentelemetry/api';
import '../../index-BXwGr3N7.js';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import '../../types-CwTG2XyQ.js';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../../vector/index.js';
import '../../vector/filter/index.js';
import '../../tts/index.js';

interface LibSQLConfig {
    url: string;
    authToken?: string;
}
declare class LibSQLStore extends MastraStorage {
    private client;
    constructor({ config }: {
        config: LibSQLConfig;
    });
    protected rewriteDbUrl(url: string): string;
    private getCreateTableSQL;
    createTable({ tableName, schema, }: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
    }): Promise<void>;
    clearTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    private prepareStatement;
    insert({ tableName, record }: {
        tableName: TABLE_NAMES;
        record: Record<string, any>;
    }): Promise<void>;
    batchInsert({ tableName, records }: {
        tableName: TABLE_NAMES;
        records: Record<string, any>[];
    }): Promise<void>;
    load<R>({ tableName, keys }: {
        tableName: TABLE_NAMES;
        keys: Record<string, string>;
    }): Promise<R | null>;
    getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    getThreadsByResourceId({ resourceId }: {
        resourceId: string;
    }): Promise<StorageThreadType[]>;
    saveThread({ thread }: {
        thread: StorageThreadType;
    }): Promise<StorageThreadType>;
    updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    deleteThread({ threadId }: {
        threadId: string;
    }): Promise<void>;
    private parseRow;
    getMessages<T extends MessageType[]>({ threadId, selectBy }: StorageGetMessagesArg): Promise<T>;
    saveMessages({ messages }: {
        messages: MessageType[];
    }): Promise<MessageType[]>;
    private transformEvalRow;
    getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
    getTraces({ name, scope, page, perPage, attributes, }?: {
        name?: string;
        scope?: string;
        page: number;
        perPage: number;
        attributes?: Record<string, string>;
    }): Promise<any[]>;
}

export { LibSQLStore as DefaultStorage, type LibSQLConfig, LibSQLStore };
