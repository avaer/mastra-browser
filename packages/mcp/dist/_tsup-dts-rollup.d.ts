import type { ClientCapabilities } from '@modelcontextprotocol/sdk/types.js';
import { FastMCP } from 'fastmcp';
import { MastraBase } from '@mastra/core/base';
import type { Protocol } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

declare class MastraMCPClient extends MastraBase {
    name: string;
    private transport;
    private client;
    private readonly timeout;
    constructor({ name, version, server, capabilities, timeout, }: {
        name: string;
        server: MastraMCPServerDefinition;
        capabilities?: ClientCapabilities;
        version?: string;
        timeout?: number;
    });
    private isConnected;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    resources(): Promise<ReturnType<Protocol<any, any, any>['request']>>;
    tools(): Promise<Record<string, any>>;
}
export { MastraMCPClient }
export { MastraMCPClient as MastraMCPClient_alias_1 }

declare type MastraMCPServerDefinition = any | SSEClientParameters;
export { MastraMCPServerDefinition }
export { MastraMCPServerDefinition as MastraMCPServerDefinition_alias_1 }

declare class MCPConfiguration extends MastraBase {
    private serverConfigs;
    private id;
    constructor(args: {
        id?: string;
        servers: Record<string, MastraMCPServerDefinition>;
    });
    private addToInstanceCache;
    private makeId;
    disconnect(): Promise<void>;
    getTools(): Promise<Record<string, any>>;
    getToolsets(): Promise<Record<string, Record<string, any>>>;
    private mcpClientsById;
    private getConnectedClient;
    private eachClientTools;
}
export { MCPConfiguration }
export { MCPConfiguration as MCPConfiguration_alias_1 }

export declare const server: FastMCP<undefined>;

export declare const server_alias_1: FastMCP<undefined>;

declare type SSEClientParameters = {
    url: URL;
} & ConstructorParameters<typeof SSEClientTransport>[1];

export { }
