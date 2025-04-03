'use strict';

var chunkLUYBA3WN_cjs = require('./chunk-LUYBA3WN.cjs');
var chunkSWYZHOFJ_cjs = require('./chunk-SWYZHOFJ.cjs');
var chunkXBEAMXR5_cjs = require('./chunk-XBEAMXR5.cjs');
var chunk2HLDXBUY_cjs = require('./chunk-2HLDXBUY.cjs');
var chunkSI6PHYGD_cjs = require('./chunk-SI6PHYGD.cjs');
var chunkI3R2VONK_cjs = require('./chunk-I3R2VONK.cjs');
var chunkR4LKHL67_cjs = require('./chunk-R4LKHL67.cjs');
var chunkSWSJNNXO_cjs = require('./chunk-SWSJNNXO.cjs');
var chunkXXM463NA_cjs = require('./chunk-XXM463NA.cjs');
var chunkSUWCCDLE_cjs = require('./chunk-SUWCCDLE.cjs');
var chunkQVQCHA2A_cjs = require('./chunk-QVQCHA2A.cjs');
var chunkIXT3T67O_cjs = require('./chunk-IXT3T67O.cjs');
var chunkMZW7EZIY_cjs = require('./chunk-MZW7EZIY.cjs');
var chunk4FUCJCP2_cjs = require('./chunk-4FUCJCP2.cjs');
var chunkIYB4E5SF_cjs = require('./chunk-IYB4E5SF.cjs');
var chunkOJDVHIBJ_cjs = require('./chunk-OJDVHIBJ.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');

// src/agent/index.warning.ts
var _Agent = class _Agent extends chunkSWSJNNXO_cjs.Agent {
  constructor(config) {
    super(config);
    this.logger.warn('Please import "Agent from "@mastra/core/agent" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_Agent, "Agent");
var Agent2 = _Agent;

// src/base.warning.ts
var _MastraBase = class _MastraBase extends chunkSUWCCDLE_cjs.MastraBase {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraBase" from "@mastra/core/base" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_MastraBase, "MastraBase");
var MastraBase2 = _MastraBase;

// src/storage/base.warning.ts
var _MastraStorage = class _MastraStorage extends chunkI3R2VONK_cjs.MastraStorage {
  constructor({ name }) {
    super({
      name
    });
    this.logger.warn('Please import "MastraStorage" from "@mastra/core/storage" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_MastraStorage, "MastraStorage");
var MastraStorage2 = _MastraStorage;

// src/integration/integration.warning.ts
var _Integration = class _Integration extends chunkIYB4E5SF_cjs.Integration {
  constructor() {
    super();
    console.warn('Please import "Integration" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_Integration, "Integration");
var Integration2 = _Integration;

// src/integration/openapi-toolset.warning.ts
var _OpenAPIToolset = class _OpenAPIToolset extends chunkIYB4E5SF_cjs.OpenAPIToolset {
  constructor() {
    super();
    console.warn('Please import "OpenAPIToolset" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_OpenAPIToolset, "OpenAPIToolset");
var OpenAPIToolset2 = _OpenAPIToolset;

// src/logger/index.warning.ts
function createLogger2(options) {
  console.warn('Please import "createLogger" from "@mastra/core/logger" instead of "@mastra/core"');
  return chunkQVQCHA2A_cjs.createLogger(options);
}
chunk7D636BPD_cjs.__name(createLogger2, "createLogger");

// src/memory/index.warning.ts
var _MastraMemory = class _MastraMemory extends chunkSI6PHYGD_cjs.MastraMemory {
  constructor(_arg) {
    super({ name: `Deprecated memory` });
    this.logger.warn('Please import "MastraMemory" from "@mastra/core/memory" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_MastraMemory, "MastraMemory");
var MastraMemory2 = _MastraMemory;

// src/tools/index.warning.ts
var _Tool = class _Tool extends chunkOJDVHIBJ_cjs.Tool {
  constructor(opts) {
    super(opts);
    console.warn('Please import "Tool" from "@mastra/core/tools" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_Tool, "Tool");
var Tool2 = _Tool;

// src/tts/index.warning.ts
var _MastraTTS = class _MastraTTS extends chunkLUYBA3WN_cjs.MastraTTS {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraTTS" from "@mastra/core/tts" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_MastraTTS, "MastraTTS");
var MastraTTS2 = _MastraTTS;

// src/vector/index.warning.ts
var _MastraVector = class _MastraVector extends chunkSWYZHOFJ_cjs.MastraVector {
  constructor() {
    super();
    this.logger.warn('Please import "MastraVector" from "@mastra/core/vector" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_MastraVector, "MastraVector");
var MastraVector2 = _MastraVector;

// src/workflows/workflow.warning.ts
var _Workflow = class _Workflow extends chunkXBEAMXR5_cjs.Workflow {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "Workflow" from "@mastra/core/workflows" instead of "@mastra/core"');
  }
};
chunk7D636BPD_cjs.__name(_Workflow, "Workflow");
var Workflow2 = _Workflow;

Object.defineProperty(exports, "Step", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.Step; }
});
Object.defineProperty(exports, "WhenConditionReturnValue", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.WhenConditionReturnValue; }
});
Object.defineProperty(exports, "createStep", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.createStep; }
});
Object.defineProperty(exports, "getActivePathsAndStatus", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.getActivePathsAndStatus; }
});
Object.defineProperty(exports, "getResultActivePaths", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.getResultActivePaths; }
});
Object.defineProperty(exports, "getStepResult", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.getStepResult; }
});
Object.defineProperty(exports, "getSuspendedPaths", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.getSuspendedPaths; }
});
Object.defineProperty(exports, "isErrorEvent", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isErrorEvent; }
});
Object.defineProperty(exports, "isFinalState", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isFinalState; }
});
Object.defineProperty(exports, "isLimboState", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isLimboState; }
});
Object.defineProperty(exports, "isTransitionEvent", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isTransitionEvent; }
});
Object.defineProperty(exports, "isVariableReference", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isVariableReference; }
});
Object.defineProperty(exports, "isWorkflow", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.isWorkflow; }
});
Object.defineProperty(exports, "mergeChildValue", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.mergeChildValue; }
});
Object.defineProperty(exports, "recursivelyCheckForFinalState", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.recursivelyCheckForFinalState; }
});
Object.defineProperty(exports, "resolveVariables", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.resolveVariables; }
});
Object.defineProperty(exports, "updateStepInHierarchy", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.updateStepInHierarchy; }
});
Object.defineProperty(exports, "workflowToStep", {
  enumerable: true,
  get: function () { return chunkXBEAMXR5_cjs.workflowToStep; }
});
Object.defineProperty(exports, "Mastra", {
  enumerable: true,
  get: function () { return chunk2HLDXBUY_cjs.Mastra; }
});
Object.defineProperty(exports, "CohereRelevanceScorer", {
  enumerable: true,
  get: function () { return chunkR4LKHL67_cjs.CohereRelevanceScorer; }
});
Object.defineProperty(exports, "MastraAgentRelevanceScorer", {
  enumerable: true,
  get: function () { return chunkR4LKHL67_cjs.MastraAgentRelevanceScorer; }
});
Object.defineProperty(exports, "createSimilarityPrompt", {
  enumerable: true,
  get: function () { return chunkR4LKHL67_cjs.createSimilarityPrompt; }
});
Object.defineProperty(exports, "InstrumentClass", {
  enumerable: true,
  get: function () { return chunkXXM463NA_cjs.InstrumentClass; }
});
Object.defineProperty(exports, "OTLPStorageExporter", {
  enumerable: true,
  get: function () { return chunkXXM463NA_cjs.OTLPTraceExporter; }
});
Object.defineProperty(exports, "Telemetry", {
  enumerable: true,
  get: function () { return chunkXXM463NA_cjs.Telemetry; }
});
Object.defineProperty(exports, "hasActiveTelemetry", {
  enumerable: true,
  get: function () { return chunkXXM463NA_cjs.hasActiveTelemetry; }
});
Object.defineProperty(exports, "withSpan", {
  enumerable: true,
  get: function () { return chunkXXM463NA_cjs.withSpan; }
});
Object.defineProperty(exports, "LogLevel", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.LogLevel; }
});
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.Logger; }
});
Object.defineProperty(exports, "LoggerTransport", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.LoggerTransport; }
});
Object.defineProperty(exports, "MultiLogger", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.MultiLogger; }
});
Object.defineProperty(exports, "RegisteredLogger", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.RegisteredLogger; }
});
Object.defineProperty(exports, "combineLoggers", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.combineLoggers; }
});
Object.defineProperty(exports, "noopLogger", {
  enumerable: true,
  get: function () { return chunkQVQCHA2A_cjs.noopLogger; }
});
Object.defineProperty(exports, "checkEvalStorageFields", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.checkEvalStorageFields; }
});
Object.defineProperty(exports, "createMastraProxy", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.createMastraProxy; }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.deepMerge; }
});
Object.defineProperty(exports, "delay", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.delay; }
});
Object.defineProperty(exports, "ensureAllMessagesAreCoreMessages", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.ensureAllMessagesAreCoreMessages; }
});
Object.defineProperty(exports, "ensureToolProperties", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.ensureToolProperties; }
});
Object.defineProperty(exports, "isVercelTool", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.isVercelTool; }
});
Object.defineProperty(exports, "jsonSchemaPropertiesToTSTypes", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.jsonSchemaPropertiesToTSTypes; }
});
Object.defineProperty(exports, "jsonSchemaToModel", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.jsonSchemaToModel; }
});
Object.defineProperty(exports, "makeCoreTool", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.makeCoreTool; }
});
Object.defineProperty(exports, "maskStreamTags", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.maskStreamTags; }
});
Object.defineProperty(exports, "resolveSerializedZodOutput", {
  enumerable: true,
  get: function () { return chunkIXT3T67O_cjs.resolveSerializedZodOutput; }
});
Object.defineProperty(exports, "Metric", {
  enumerable: true,
  get: function () { return chunkMZW7EZIY_cjs.Metric; }
});
Object.defineProperty(exports, "evaluate", {
  enumerable: true,
  get: function () { return chunkMZW7EZIY_cjs.evaluate; }
});
Object.defineProperty(exports, "AvailableHooks", {
  enumerable: true,
  get: function () { return chunk4FUCJCP2_cjs.AvailableHooks; }
});
Object.defineProperty(exports, "executeHook", {
  enumerable: true,
  get: function () { return chunk4FUCJCP2_cjs.executeHook; }
});
Object.defineProperty(exports, "registerHook", {
  enumerable: true,
  get: function () { return chunk4FUCJCP2_cjs.registerHook; }
});
Object.defineProperty(exports, "createTool", {
  enumerable: true,
  get: function () { return chunkOJDVHIBJ_cjs.createTool; }
});
exports.Agent = Agent2;
exports.Integration = Integration2;
exports.MastraBase = MastraBase2;
exports.MastraMemory = MastraMemory2;
exports.MastraStorage = MastraStorage2;
exports.MastraTTS = MastraTTS2;
exports.MastraVector = MastraVector2;
exports.OpenAPIToolset = OpenAPIToolset2;
exports.Tool = Tool2;
exports.Workflow = Workflow2;
exports.createLogger = createLogger2;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map