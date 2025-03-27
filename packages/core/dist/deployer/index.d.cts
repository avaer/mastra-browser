import { MastraBundler, IBundler } from '../bundler/index.cjs';
import '../base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '../index-BXwGr3N7.cjs';
import 'stream';
import '@opentelemetry/sdk-trace-base';

interface IDeployer extends IBundler {
    deploy(outputDirectory: string): Promise<void>;
}
declare abstract class MastraDeployer extends MastraBundler implements IDeployer {
    constructor({ name }: {
        name: string;
    });
    abstract deploy(outputDirectory: string): Promise<void>;
}

export { type IDeployer, MastraDeployer };
