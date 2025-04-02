import { DefaultStorage } from '.';
import { TABLE_THREADS, TABLE_MESSAGES } from '../constants';
import type { StorageThreadType } from '../../memory/types';

describe('PGliteStorage', () => {
  let storage: DefaultStorage;

  beforeAll(async () => {
    storage = new DefaultStorage({ config: { dataDir: 'memory://' } });
    await storage.init();
  });

  beforeEach(async () => {
    await storage.clearTable({ tableName: TABLE_THREADS });
    await storage.clearTable({ tableName: TABLE_MESSAGES });
  });

  it('can save and load threads', async () => {
    const thread: StorageThreadType = {
      id: 'thread-1',
      resourceId: 'resource-1',
      title: 'Test Thread',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedThread = await storage.saveThread({ thread });
    expect(savedThread).toEqual(thread);

    const loadedThread = await storage.getThreadById({ threadId: thread.id });
    expect(loadedThread).toEqual(thread);
  });

  it('can update threads', async () => {
    const thread: StorageThreadType = {
      id: 'thread-1',
      resourceId: 'resource-1',
      title: 'Test Thread',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storage.saveThread({ thread });

    const updatedThread = await storage.updateThread({
      id: thread.id,
      title: 'Updated Thread',
      metadata: { test: false, updated: true },
    });

    expect(updatedThread.title).toBe('Updated Thread');
    expect(updatedThread.metadata).toEqual({ test: false, updated: true });

    const loadedThread = await storage.getThreadById({ threadId: thread.id });
    expect(loadedThread?.title).toBe('Updated Thread');
    expect(loadedThread?.metadata).toEqual({ test: false, updated: true });
  });

  it('can get threads by resourceId', async () => {
    const thread1: StorageThreadType = {
      id: 'thread-1',
      resourceId: 'resource-1',
      title: 'Test Thread 1',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const thread2: StorageThreadType = {
      id: 'thread-2',
      resourceId: 'resource-1',
      title: 'Test Thread 2',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const thread3: StorageThreadType = {
      id: 'thread-3',
      resourceId: 'resource-2',
      title: 'Test Thread 3',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storage.saveThread({ thread: thread1 });
    await storage.saveThread({ thread: thread2 });
    await storage.saveThread({ thread: thread3 });

    const resource1Threads = await storage.getThreadsByResourceId({ resourceId: 'resource-1' });
    expect(resource1Threads.length).toBe(2);
    expect(resource1Threads.map(t => t.id).sort()).toEqual(['thread-1', 'thread-2'].sort());

    const resource2Threads = await storage.getThreadsByResourceId({ resourceId: 'resource-2' });
    expect(resource2Threads.length).toBe(1);
    expect(resource2Threads[0].id).toBe('thread-3');
  });

  it('can delete threads', async () => {
    const thread: StorageThreadType = {
      id: 'thread-1',
      resourceId: 'resource-1',
      title: 'Test Thread',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storage.saveThread({ thread });
    await storage.deleteThread({ threadId: thread.id });

    const loadedThread = await storage.getThreadById({ threadId: thread.id });
    expect(loadedThread).toBeNull();
  });

  it('can save and get messages', async () => {
    const thread: StorageThreadType = {
      id: 'thread-1',
      resourceId: 'resource-1',
      title: 'Test Thread',
      metadata: { test: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await storage.saveThread({ thread });

    const messages = [
      {
        id: 'msg-1',
        threadId: thread.id,
        role: 'user',
        content: 'Hello',
        type: 'text',
        createdAt: new Date(),
      },
      {
        id: 'msg-2',
        threadId: thread.id,
        role: 'assistant',
        content: 'Hi there!',
        type: 'text',
        createdAt: new Date(Date.now() + 1000),
      },
    ];

    await storage.saveMessages({ messages });

    const retrievedMessages = await storage.getMessages({ threadId: thread.id });
    expect(retrievedMessages.length).toBe(2);
    expect(retrievedMessages.map(m => m.id).sort()).toEqual(['msg-1', 'msg-2'].sort());
  });
});