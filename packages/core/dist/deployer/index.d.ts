import { IBundler, MastraBundler } from '../bundler/index.js';
import '../base-Dq_cxikD.js';
import '@opentelemetry/api';
import '../index-BXwGr3N7.js';
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
