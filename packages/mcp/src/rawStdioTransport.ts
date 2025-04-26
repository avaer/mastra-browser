import { Writable, Readable } from "stream";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

export class RawStdioClientTransport implements Transport {
  private stdio: [Writable, Readable];

  get stdin(): Writable {
    return this.stdio[0];
  }
  get stdout(): Readable {
    return this.stdio[1];
  }

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage) => void;
  constructor({
    stdio,
  }: {
    stdio: [Writable, Readable];
  }) {
    this.stdio = stdio;

    this.listen();
  }
  private listen() {
    let acc = '';
    this.stdout.setEncoding('utf-8');
    this.stdout.on("data", (data: string) => {
      acc += data;
      
      // Process complete JSON lines
      const lines = acc.split('\n');
      while (lines.length > 1) {
        const line = lines.shift()!;
        if (line.trim()) {
          try {
            const message = JSON.parse(line);
            if (this.onmessage) {
              this.onmessage(message);
            }
          } catch (error: any) {
            if (this.onerror) {
              this.onerror(new Error(`Failed to parse JSON: ${error.stack ?? error.message ?? error}`));
            }
          }
        }
      }

      // Keep the last potentially incomplete line in the accumulator
      if (lines.length > 0) {
        acc = lines.join('\n');
      }
    });
    
    this.stdout.on("error", (error) => {
      if (this.onerror) {
        this.onerror(error);
      }
    });
    
    this.stdout.on("close", () => {
      if (this.onclose) {
        this.onclose();
      }
    });
  }
  /**
   * Starts the server process and prepares to communicate with it.
   */
  async start(): Promise<void> {
    // throw new Error("Method not implemented.");
  }
  /**
   * The stderr stream of the child process, if `StdioServerParameters.stderr` was set to "pipe" or "overlapped".
   *
   * This is only available after the process has been started.
   */
  // get stderr(): Stream | null;
  // private processReadBuffer;
  async close(): Promise<void> {
    // throw new Error("Method not implemented.");
  }
  async send(message: JSONRPCMessage): Promise<void> {
    this.stdin.write(JSON.stringify(message) + "\n");
  }
}
