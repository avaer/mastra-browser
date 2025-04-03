import { MastraTTS } from './chunk-FDEYY6VR.js';
import { MastraVector } from './chunk-I4XYJ73M.js';
import { Workflow } from './chunk-EHDQFWFS.js';
export { Step, WhenConditionReturnValue, createStep, getActivePathsAndStatus, getResultActivePaths, getStepResult, getSuspendedPaths, isErrorEvent, isFinalState, isLimboState, isTransitionEvent, isVariableReference, isWorkflow, mergeChildValue, recursivelyCheckForFinalState, resolveVariables, updateStepInHierarchy, workflowToStep } from './chunk-EHDQFWFS.js';
export { Mastra } from './chunk-W36VRYRL.js';
import { MastraMemory } from './chunk-VCHKS2N3.js';
import { MastraStorage } from './chunk-UUMEB542.js';
export { CohereRelevanceScorer, MastraAgentRelevanceScorer, createSimilarityPrompt } from './chunk-SRRHOPDB.js';
import { Agent } from './chunk-D2FQW5XK.js';
export { InstrumentClass, OTLPTraceExporter as OTLPStorageExporter, Telemetry, hasActiveTelemetry, withSpan } from './chunk-GCXZG37R.js';
import { MastraBase } from './chunk-LE72NI7K.js';
import { createLogger } from './chunk-HEAZ5SGJ.js';
export { LogLevel, Logger, LoggerTransport, MultiLogger, RegisteredLogger, combineLoggers, noopLogger } from './chunk-HEAZ5SGJ.js';
export { checkEvalStorageFields, createMastraProxy, deepMerge, delay, ensureAllMessagesAreCoreMessages, ensureToolProperties, isVercelTool, jsonSchemaPropertiesToTSTypes, jsonSchemaToModel, makeCoreTool, maskStreamTags, resolveSerializedZodOutput } from './chunk-HXRGB7YQ.js';
export { Metric, evaluate } from './chunk-DMUJFXZB.js';
export { AvailableHooks, executeHook, registerHook } from './chunk-7J6WQGTU.js';
import { Integration, OpenAPIToolset } from './chunk-C6LZCVRN.js';
import { Tool } from './chunk-YNOU42YW.js';
export { createTool } from './chunk-YNOU42YW.js';
import { __name } from './chunk-WH5OY6PO.js';

// src/agent/index.warning.ts
var _Agent = class _Agent extends Agent {
  constructor(config) {
    super(config);
    this.logger.warn('Please import "Agent from "@mastra/core/agent" instead of "@mastra/core"');
  }
};
__name(_Agent, "Agent");
var Agent2 = _Agent;

// src/base.warning.ts
var _MastraBase = class _MastraBase extends MastraBase {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraBase" from "@mastra/core/base" instead of "@mastra/core"');
  }
};
__name(_MastraBase, "MastraBase");
var MastraBase2 = _MastraBase;

// src/storage/base.warning.ts
var _MastraStorage = class _MastraStorage extends MastraStorage {
  constructor({ name }) {
    super({
      name
    });
    this.logger.warn('Please import "MastraStorage" from "@mastra/core/storage" instead of "@mastra/core"');
  }
};
__name(_MastraStorage, "MastraStorage");
var MastraStorage2 = _MastraStorage;

// src/integration/integration.warning.ts
var _Integration = class _Integration extends Integration {
  constructor() {
    super();
    console.warn('Please import "Integration" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};
__name(_Integration, "Integration");
var Integration2 = _Integration;

// src/integration/openapi-toolset.warning.ts
var _OpenAPIToolset = class _OpenAPIToolset extends OpenAPIToolset {
  constructor() {
    super();
    console.warn('Please import "OpenAPIToolset" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};
__name(_OpenAPIToolset, "OpenAPIToolset");
var OpenAPIToolset2 = _OpenAPIToolset;

// src/logger/index.warning.ts
function createLogger2(options) {
  console.warn('Please import "createLogger" from "@mastra/core/logger" instead of "@mastra/core"');
  return createLogger(options);
}
__name(createLogger2, "createLogger");

// src/memory/index.warning.ts
var _MastraMemory = class _MastraMemory extends MastraMemory {
  constructor(_arg) {
    super({ name: `Deprecated memory` });
    this.logger.warn('Please import "MastraMemory" from "@mastra/core/memory" instead of "@mastra/core"');
  }
};
__name(_MastraMemory, "MastraMemory");
var MastraMemory2 = _MastraMemory;

// src/tools/index.warning.ts
var _Tool = class _Tool extends Tool {
  constructor(opts) {
    super(opts);
    console.warn('Please import "Tool" from "@mastra/core/tools" instead of "@mastra/core"');
  }
};
__name(_Tool, "Tool");
var Tool2 = _Tool;

// src/tts/index.warning.ts
var _MastraTTS = class _MastraTTS extends MastraTTS {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraTTS" from "@mastra/core/tts" instead of "@mastra/core"');
  }
};
__name(_MastraTTS, "MastraTTS");
var MastraTTS2 = _MastraTTS;

// src/vector/index.warning.ts
var _MastraVector = class _MastraVector extends MastraVector {
  constructor() {
    super();
    this.logger.warn('Please import "MastraVector" from "@mastra/core/vector" instead of "@mastra/core"');
  }
};
__name(_MastraVector, "MastraVector");
var MastraVector2 = _MastraVector;

// src/workflows/workflow.warning.ts
var _Workflow = class _Workflow extends Workflow {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "Workflow" from "@mastra/core/workflows" instead of "@mastra/core"');
  }
};
__name(_Workflow, "Workflow");
var Workflow2 = _Workflow;

export { Agent2 as Agent, Integration2 as Integration, MastraBase2 as MastraBase, MastraMemory2 as MastraMemory, MastraStorage2 as MastraStorage, MastraTTS2 as MastraTTS, MastraVector2 as MastraVector, OpenAPIToolset2 as OpenAPIToolset, Tool2 as Tool, Workflow2 as Workflow, createLogger2 as createLogger };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map