import type { AiMessageType } from '@mastra/core';
import type { CoreMessage } from '@mastra/core';
import type { CoreTool } from '@mastra/core';
import { MastraMemory } from '@mastra/core/memory';
import type { MemoryConfig } from '@mastra/core/memory';
import type { MessageType } from '@mastra/core/memory';
import type { SharedMemoryConfig } from '@mastra/core/memory';
import type { StorageGetMessagesArg } from '@mastra/core/storage';
import type { StorageThreadType } from '@mastra/core/memory';

/**
 * Concrete implementation of MastraMemory that adds support for thread configuration
 * and message injection.
 */
export declare class Memory extends MastraMemory {
    constructor(config?: SharedMemoryConfig);
    private validateThreadIsOwnedByResource;
    query({ threadId, resourceId, selectBy, threadConfig, }: StorageGetMessagesArg): Promise<{
        messages: CoreMessage[];
        uiMessages: AiMessageType[];
    }>;
    rememberMessages({ threadId, resourceId, vectorMessageSearch, config, }: {
        threadId: string;
        resourceId?: string;
        vectorMessageSearch?: string;
        config?: MemoryConfig;
    }): Promise<{
        threadId: string;
        messages: CoreMessage[];
        uiMessages: AiMessageType[];
    }>;
    getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    getThreadsByResourceId({ resourceId }: {
        resourceId: string;
    }): Promise<StorageThreadType[]>;
    saveThread({ thread, memoryConfig, }: {
        thread: StorageThreadType;
        memoryConfig?: MemoryConfig;
    }): Promise<StorageThreadType>;
    updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    deleteThread(threadId: string): Promise<void>;
    private embedMessageContent;
    saveMessages({ messages, memoryConfig, }: {
        messages: MessageType[];
        memoryConfig?: MemoryConfig;
    }): Promise<MessageType[]>;
    protected mutateMessagesToHideWorkingMemory(messages: MessageType[]): void;
    protected parseWorkingMemory(text: string): string | null;
    getWorkingMemory({ threadId }: {
        threadId: string;
    }): Promise<string | null>;
    private saveWorkingMemory;
    getSystemMessage({ threadId, memoryConfig, }: {
        threadId: string;
        memoryConfig?: MemoryConfig;
    }): Promise<string | null>;
    defaultWorkingMemoryTemplate: string;
    private getWorkingMemoryWithInstruction;
    private getWorkingMemoryToolInstruction;
    getTools(config?: MemoryConfig): Record<string, CoreTool>;
}

export declare const updateWorkingMemoryTool: CoreTool;

export { }
