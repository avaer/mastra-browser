import type { ToolsInput } from '@mastra/core/agent';
import { MastraBase } from '@mastra/core/base';
import { createTool, Tool } from '@mastra/core/tools';
import { jsonSchemaToModel } from '@mastra/core/utils';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { DEFAULT_REQUEST_TIMEOUT_MSEC } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type { Protocol } from '@modelcontextprotocol/sdk/shared/protocol.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { ClientCapabilities, ResourceListChangedNotification } from '@modelcontextprotocol/sdk/types.js';
import { CallToolResultSchema, ListResourcesResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

type SSEClientParameters = {
  url: URL;
} & ConstructorParameters<typeof SSEClientTransport>[1];

export type ServerSpecification = {
  version?: {
    name: string;
    version: string;
  };
  capabilities?: any;
  instructions?: string;
};

function deepRequiredInner<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
  const typeName = schema._def.typeName;

  // Remove optional wrappers by unwrapping the inner type.
  if (typeName === 'ZodOptional' || typeName === 'ZodNullable') {
    return deepRequiredInner(schema._def.innerType);
  }

  // If it's an object, process each property recursively.
  if (typeName === 'ZodObject') {
    // Some objects use a lazy shape (a function) so we call it if needed.
    const shape = typeof schema._def.shape === 'function'
      ? schema._def.shape()
      : schema._def.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};
    for (const key in shape) {
      newShape[key] = deepRequiredInner(shape[key]);
    }
    return z.object(newShape);
  }

  // For arrays, process the element type.
  if (typeName === 'ZodArray') {
    return z.array(deepRequiredInner((schema as any).element || schema._def.type));
  }

  // For unions, process every option.
  if (typeName === 'ZodUnion') {
    return z.union(schema._def.options.map(deepRequiredInner));
  }

  // For intersections, process both sides.
  if (typeName === 'ZodIntersection') {
    return z.intersection(
      deepRequiredInner(schema._def.left),
      deepRequiredInner(schema._def.right)
    );
  }

  // For records, process the value type.
  if (typeName === 'ZodRecord') {
    return z.record(deepRequiredInner(schema._def.valueType));
  }

  // Other schema types are returned as-is.
  return schema;
}
function deepRequired<T extends z.ZodTypeAny>(schema: T): z.ZodTypeAny {
  return deepRequiredInner(schema);
}

export type MastraMCPServerDefinition = any | SSEClientParameters;

export class MastraMCPClient extends MastraBase {
  name: string;
  private transport: Transport;
  private client: Client;
  private readonly timeout: number;
  private resourceSubscriptions: Map<string, number> = new Map(); // reference count of subscriptions
  private eventTarget: EventTarget = new EventTarget();
  
  constructor({
    name,
    version = '1.0.0',
    server,
    capabilities = {},
    timeout = DEFAULT_REQUEST_TIMEOUT_MSEC,
  }: {
    name: string;
    server: MastraMCPServerDefinition;
    capabilities?: ClientCapabilities;
    version?: string;
    timeout?: number;
  }) {
    super({ name: 'MastraMCPClient' });
    this.name = name;
    this.timeout = timeout;

    if (`url` in server) {
      this.transport = new SSEClientTransport(server.url, {
        requestInit: server.requestInit,
        eventSourceInit: server.eventSourceInit,
      });
    } else {
      // this.transport = new StdioClientTransport({
      //   ...server,
      //   // without ...getDefaultEnvironment() commands like npx will fail because there will be no PATH env var
      //   env: { ...getDefaultEnvironment(), ...(server.env || {}) },
      // });
      this.transport = null as any;
    }

    this.client = new Client(
      {
        name,
        version,
      },
      {
        capabilities,
      },
    );
  }

  private isConnected = false;

  async connect() {
    if (this.isConnected) return;
    try {
      await this.client.connect(this.transport);
      this.isConnected = true;
      const originalOnClose = this.client.onclose;
      this.client.onclose = () => {
        this.isConnected = false;
        if (typeof originalOnClose === `function`) {
          originalOnClose();
        }
      };
      
      // Set up resource change notification handler
      this.setupResourceChangeHandler();
      
      // asyncExitHook(
      //   async () => {
      //     this.logger.debug(`Disconnecting ${this.name} MCP server`);
      //     await this.disconnect();
      //   },
      //   { wait: 5000 },
      // );

      // process.on('SIGTERM', () => gracefulExit());
    } catch (e) {
      this.logger.error(
        `Failed connecting to MCPClient with name ${this.name}.\n${e instanceof Error ? e.stack : JSON.stringify(e, null, 2)}`,
      );
      this.isConnected = false;
      throw e;
    }
  }

  async disconnect() {
    return await this.client.close();
  }

  getServerSpecification(): ServerSpecification {
    const capabilities = this.client.getServerCapabilities();
    const version = this.client.getServerVersion();
    const instructions = this.client.getInstructions();
    return {
      capabilities,
      version,
      instructions,
    };
  }

  subscribeToNotifications<T extends z.ZodTypeAny>(method: string, paramsSchema: T, handler: (notification: z.infer<T>) => void) {
    this.client.setNotificationHandler(z.object({
      method: z.literal(method),
      params: paramsSchema,
    }), (notification) => {
      handler(notification.params);
    });
  }

  private setupResourceChangeHandler() {
    // try {
      // Set up handler for resource change notifications
      this.client.setNotificationHandler(z.object({
        method: z.literal('notifications/resources/updated'),
        params: z.object({
          uri: z.string(),
        }),
      }), async (notification, ...rest) => {
        console.log(`Resource changed notification`, notification, rest);
        const {
          uri,
        } = notification.params;

        const { contents } = await this.client.readResource({ uri });
        console.log(`Read resource`, {
          uri,
          contents,
        });

        // Dispatch event for this resource change
        const event = new MessageEvent(`resource:${uri}`, { 
          data: {
            uri,
            contents,
          },
        });
        this.eventTarget.dispatchEvent(event as any);
      });
    // } catch (e) {
    //   this.logger.error(`Failed to set up resource change handler: ${e}`);
    // }
  }

  // TODO: do the type magic to return the right method type. Right now we get infinitely deep infered type errors from Zod without using "any"

  async resources() {
    const resourcesResult = await this.client.listResources();
    // console.log(`resourcesResult`, resourcesResult);
    return resourcesResult.resources;
  }
  
  /**
   * Subscribe to a resource by URI
   * @param uri The URI of the resource to subscribe to
   * @returns A promise that resolves when the subscription is complete
   */
  async subscribe(uri: string, onUpdate: (contents: any) => void): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Client is not connected. Please call connect() first.');
    }

    // listen for the resource:uri event and call onUpdate with the contents
    this.eventTarget.addEventListener(`resource:${uri}`, onUpdate);
    
    // Check if already subscribed
    if (this.resourceSubscriptions.has(uri)) {
      const count = this.resourceSubscriptions.get(uri) || 0;
      this.resourceSubscriptions.set(uri, count + 1);
    } else {
      try {
        console.log(`Client subscribing to resource`, {
          uri,
        });
        await this.client.subscribeResource({ uri });
        console.log(`Client subscribed to resource`, {
          uri,
        });
        this.resourceSubscriptions.set(uri, 1);
        this.logger.debug(`Subscribed to resource: ${uri}`);
      } catch (e) {
        this.logger.error(`Failed to subscribe to resource ${uri}: ${e}`);
        throw e;
      }
    }
  }
  
  /**
   * Unsubscribe from a resource
   * @param uri The URI of the resource to unsubscribe from
   * @returns A promise that resolves when unsubscription is complete
   */
  async unsubscribe(uri: string, onUpdate: (contents: any) => void): Promise<void> {
    // remove the listener for the resource:uri event
    this.eventTarget.removeEventListener(`resource:${uri}`, onUpdate);

    if (!this.isConnected || !this.resourceSubscriptions.has(uri)) {
      throw new Error('Client is not connected or resource not subscribed. Please call connect() first.');
    }
    
    // Update reference count
    const count = this.resourceSubscriptions.get(uri) || 0;
    if (count > 1) {
      this.resourceSubscriptions.set(uri, count - 1);
    } else {
      try {
        await this.client.unsubscribeResource({ uri });
      } catch (e) {
        this.logger.error(`Failed to unsubscribe from resource ${uri}: ${e}`);
        throw e;
      }
    }
  }

  /**
   * Read a resource by URI
   * @param uri The URI of the resource to read
   * @returns A promise that resolves with the resource contents
   */
  async read(uri: string): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Client is not connected. Please call connect() first.');
    }
    
    try {
      return await this.client.readResource({ uri });
    } catch (e) {
      this.logger.error(`Failed to read resource ${uri}: ${e}`);
      throw e;
    }
  }

  async tools() {
    const { tools } = await this.client.listTools();
    const toolsRes: Record<string, Tool<any, any, any>> = {};
    tools.forEach(tool => {
      const s = jsonSchemaToModel(tool.inputSchema);
      const mastraTool = createTool({
        id: `${this.name}_${tool.name}`,
        description: tool.description || '',
        inputSchema: deepRequired(s),
        execute: async ({ context }) => {
          try {
            const res = await this.client.callTool(
              {
                name: tool.name,
                arguments: context,
              },
              CallToolResultSchema,
              {
                timeout: this.timeout,
              },
            );

            return res;
          } catch (e) {
            console.log('Error calling tool', tool.name);
            console.error(e);
            throw e;
          }
        },
      });

      if (tool.name) {
        toolsRes[tool.name] = mastraTool;
      }
    });

    return toolsRes;
  }
}
