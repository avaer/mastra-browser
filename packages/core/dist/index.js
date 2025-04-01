import { MastraTTS } from './chunk-RYCNIYRH.js';
import { MastraVector } from './chunk-B6WXWFN6.js';
import { Workflow } from './chunk-R6IKP45Q.js';
export { Step, WhenConditionReturnValue, createStep, getActivePathsAndStatus, getResultActivePaths, getStepResult, getSuspendedPaths, isErrorEvent, isFinalState, isLimboState, isTransitionEvent, isVariableReference, isWorkflow, mergeChildValue, recursivelyCheckForFinalState, resolveVariables, updateStepInHierarchy, workflowToStep } from './chunk-R6IKP45Q.js';
import { Integration, OpenAPIToolset } from './chunk-PNZK456O.js';
export { Mastra } from './chunk-5DGPPDCB.js';
import { MastraMemory } from './chunk-SP2ETV3Y.js';
import { MastraStorage } from './chunk-BFE62BHD.js';
export { CohereRelevanceScorer, MastraAgentRelevanceScorer, createSimilarityPrompt } from './chunk-FMXU2DHK.js';
import { Agent } from './chunk-UGPRAEX5.js';
export { InstrumentClass, OTLPTraceExporter as OTLPStorageExporter, Telemetry, hasActiveTelemetry, withSpan } from './chunk-RHSLRFEA.js';
export { checkEvalStorageFields, createMastraProxy, deepMerge, delay, ensureAllMessagesAreCoreMessages, ensureToolProperties, isVercelTool, jsonSchemaPropertiesToTSTypes, jsonSchemaToModel, makeCoreTool, maskStreamTags, resolveSerializedZodOutput } from './chunk-2YF5JYTJ.js';
import { Tool } from './chunk-ZINPRHAN.js';
export { createTool } from './chunk-ZINPRHAN.js';
export { Metric, evaluate } from './chunk-NUDAZEOG.js';
import { MastraBase } from './chunk-WUPACWA6.js';
import { createLogger } from './chunk-UAVUAO53.js';
export { LogLevel, Logger, LoggerTransport, MultiLogger, RegisteredLogger, combineLoggers, noopLogger } from './chunk-UAVUAO53.js';
export { AvailableHooks, executeHook, registerHook } from './chunk-BB4KXGBU.js';

// src/agent/index.warning.ts
var Agent2 = class extends Agent {
  constructor(config) {
    super(config);
    this.logger.warn('Please import "Agent from "@mastra/core/agent" instead of "@mastra/core"');
  }
};

// src/base.warning.ts
var MastraBase2 = class extends MastraBase {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraBase" from "@mastra/core/base" instead of "@mastra/core"');
  }
};

// src/storage/base.warning.ts
var MastraStorage2 = class extends MastraStorage {
  constructor({ name }) {
    super({
      name
    });
    this.logger.warn('Please import "MastraStorage" from "@mastra/core/storage" instead of "@mastra/core"');
  }
};

// src/integration/integration.warning.ts
var Integration2 = class extends Integration {
  constructor() {
    super();
    console.warn('Please import "Integration" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};

// src/integration/openapi-toolset.warning.ts
var OpenAPIToolset2 = class extends OpenAPIToolset {
  constructor() {
    super();
    console.warn('Please import "OpenAPIToolset" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};

// src/logger/index.warning.ts
function createLogger2(options) {
  console.warn('Please import "createLogger" from "@mastra/core/logger" instead of "@mastra/core"');
  return createLogger(options);
}

// src/memory/index.warning.ts
var MastraMemory2 = class extends MastraMemory {
  constructor(_arg) {
    super({ name: `Deprecated memory` });
    this.logger.warn('Please import "MastraMemory" from "@mastra/core/memory" instead of "@mastra/core"');
  }
};

// src/tools/index.warning.ts
var Tool2 = class extends Tool {
  constructor(opts) {
    super(opts);
    console.warn('Please import "Tool" from "@mastra/core/tools" instead of "@mastra/core"');
  }
};

// src/tts/index.warning.ts
var MastraTTS2 = class extends MastraTTS {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraTTS" from "@mastra/core/tts" instead of "@mastra/core"');
  }
};

// src/vector/index.warning.ts
var MastraVector2 = class extends MastraVector {
  constructor() {
    super();
    this.logger.warn('Please import "MastraVector" from "@mastra/core/vector" instead of "@mastra/core"');
  }
};

// src/workflows/workflow.warning.ts
var Workflow2 = class extends Workflow {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "Workflow" from "@mastra/core/workflows" instead of "@mastra/core"');
  }
};

export { Agent2 as Agent, Integration2 as Integration, MastraBase2 as MastraBase, MastraMemory2 as MastraMemory, MastraStorage2 as MastraStorage, MastraTTS2 as MastraTTS, MastraVector2 as MastraVector, OpenAPIToolset2 as OpenAPIToolset, Tool2 as Tool, Workflow2 as Workflow, createLogger2 as createLogger };
