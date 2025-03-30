import { M as MastraBase } from '../base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '../index-BXwGr3N7.cjs';
import 'stream';
import '@opentelemetry/sdk-trace-base';

interface BuiltInModelConfig {
    provider: string;
    name: string;
    baseURL?: string;
    apiKey?: string;
}
interface TTSConfig {
    model: BuiltInModelConfig;
}
declare abstract class MastraTTS extends MastraBase {
    model: BuiltInModelConfig;
    constructor({ model }: TTSConfig);
    traced<T extends Function>(method: T, methodName: string): T;
    abstract generate({ text }: {
        text: string;
    }): Promise<any>;
    abstract stream({ text }: {
        text: string;
    }): Promise<any>;
}

export { MastraTTS, type TTSConfig };
