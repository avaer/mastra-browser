'use strict';

var chunkKKNAFCIB_cjs = require('./chunk-KKNAFCIB.cjs');
var chunkRLQZLULL_cjs = require('./chunk-RLQZLULL.cjs');
var chunkXLSROQ26_cjs = require('./chunk-XLSROQ26.cjs');
var chunkPCKQLTBW_cjs = require('./chunk-PCKQLTBW.cjs');
var chunkI7THZIJS_cjs = require('./chunk-I7THZIJS.cjs');
var chunkCEU7VHOT_cjs = require('./chunk-CEU7VHOT.cjs');
var chunkSPNVVANI_cjs = require('./chunk-SPNVVANI.cjs');
var chunkIX6VOIR7_cjs = require('./chunk-IX6VOIR7.cjs');
var chunkU7LAN3FB_cjs = require('./chunk-U7LAN3FB.cjs');
var chunkEDBJG533_cjs = require('./chunk-EDBJG533.cjs');
var chunk5FAJ6HUC_cjs = require('./chunk-5FAJ6HUC.cjs');
var chunk2W2GYEYQ_cjs = require('./chunk-2W2GYEYQ.cjs');
var chunkUV2QUUKW_cjs = require('./chunk-UV2QUUKW.cjs');
var chunkCGUKSEPG_cjs = require('./chunk-CGUKSEPG.cjs');
var chunkV5ORZPFW_cjs = require('./chunk-V5ORZPFW.cjs');
var chunkST5RMVLG_cjs = require('./chunk-ST5RMVLG.cjs');

// src/agent/index.warning.ts
var Agent2 = class extends chunkU7LAN3FB_cjs.Agent {
  constructor(config) {
    super(config);
    this.logger.warn('Please import "Agent from "@mastra/core/agent" instead of "@mastra/core"');
  }
};

// src/base.warning.ts
var MastraBase2 = class extends chunkUV2QUUKW_cjs.MastraBase {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraBase" from "@mastra/core/base" instead of "@mastra/core"');
  }
};

// src/storage/base.warning.ts
var MastraStorage2 = class extends chunkIX6VOIR7_cjs.MastraStorage {
  constructor({ name }) {
    super({
      name
    });
    this.logger.warn('Please import "MastraStorage" from "@mastra/core/storage" instead of "@mastra/core"');
  }
};

// src/integration/integration.warning.ts
var Integration2 = class extends chunkXLSROQ26_cjs.Integration {
  constructor() {
    super();
    console.warn('Please import "Integration" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};

// src/integration/openapi-toolset.warning.ts
var OpenAPIToolset2 = class extends chunkXLSROQ26_cjs.OpenAPIToolset {
  constructor() {
    super();
    console.warn('Please import "OpenAPIToolset" from "@mastra/core/integration" instead of "@mastra/core"');
  }
};

// src/logger/index.warning.ts
function createLogger2(options) {
  console.warn('Please import "createLogger" from "@mastra/core/logger" instead of "@mastra/core"');
  return chunkCGUKSEPG_cjs.createLogger(options);
}

// src/memory/index.warning.ts
var MastraMemory2 = class extends chunkI7THZIJS_cjs.MastraMemory {
  constructor(_arg) {
    super({ name: `Deprecated memory` });
    this.logger.warn('Please import "MastraMemory" from "@mastra/core/memory" instead of "@mastra/core"');
  }
};

// src/tools/index.warning.ts
var Tool2 = class extends chunk2W2GYEYQ_cjs.Tool {
  constructor(opts) {
    super(opts);
    console.warn('Please import "Tool" from "@mastra/core/tools" instead of "@mastra/core"');
  }
};

// src/tts/index.warning.ts
var MastraTTS2 = class extends chunkKKNAFCIB_cjs.MastraTTS {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "MastraTTS" from "@mastra/core/tts" instead of "@mastra/core"');
  }
};

// src/vector/index.warning.ts
var MastraVector2 = class extends chunkCEU7VHOT_cjs.MastraVector {
  constructor() {
    super();
    this.logger.warn('Please import "MastraVector" from "@mastra/core/vector" instead of "@mastra/core"');
  }
};

// src/workflows/workflow.warning.ts
var Workflow2 = class extends chunkRLQZLULL_cjs.Workflow {
  constructor(args) {
    super(args);
    this.logger.warn('Please import "Workflow" from "@mastra/core/workflows" instead of "@mastra/core"');
  }
};

Object.defineProperty(exports, "Step", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.Step; }
});
Object.defineProperty(exports, "WhenConditionReturnValue", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.WhenConditionReturnValue; }
});
Object.defineProperty(exports, "createStep", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.createStep; }
});
Object.defineProperty(exports, "getActivePathsAndStatus", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.getActivePathsAndStatus; }
});
Object.defineProperty(exports, "getResultActivePaths", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.getResultActivePaths; }
});
Object.defineProperty(exports, "getStepResult", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.getStepResult; }
});
Object.defineProperty(exports, "getSuspendedPaths", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.getSuspendedPaths; }
});
Object.defineProperty(exports, "isErrorEvent", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isErrorEvent; }
});
Object.defineProperty(exports, "isFinalState", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isFinalState; }
});
Object.defineProperty(exports, "isLimboState", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isLimboState; }
});
Object.defineProperty(exports, "isTransitionEvent", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isTransitionEvent; }
});
Object.defineProperty(exports, "isVariableReference", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isVariableReference; }
});
Object.defineProperty(exports, "isWorkflow", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.isWorkflow; }
});
Object.defineProperty(exports, "mergeChildValue", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.mergeChildValue; }
});
Object.defineProperty(exports, "recursivelyCheckForFinalState", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.recursivelyCheckForFinalState; }
});
Object.defineProperty(exports, "resolveVariables", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.resolveVariables; }
});
Object.defineProperty(exports, "updateStepInHierarchy", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.updateStepInHierarchy; }
});
Object.defineProperty(exports, "workflowToStep", {
  enumerable: true,
  get: function () { return chunkRLQZLULL_cjs.workflowToStep; }
});
Object.defineProperty(exports, "Mastra", {
  enumerable: true,
  get: function () { return chunkPCKQLTBW_cjs.Mastra; }
});
Object.defineProperty(exports, "CohereRelevanceScorer", {
  enumerable: true,
  get: function () { return chunkSPNVVANI_cjs.CohereRelevanceScorer; }
});
Object.defineProperty(exports, "MastraAgentRelevanceScorer", {
  enumerable: true,
  get: function () { return chunkSPNVVANI_cjs.MastraAgentRelevanceScorer; }
});
Object.defineProperty(exports, "createSimilarityPrompt", {
  enumerable: true,
  get: function () { return chunkSPNVVANI_cjs.createSimilarityPrompt; }
});
Object.defineProperty(exports, "InstrumentClass", {
  enumerable: true,
  get: function () { return chunkEDBJG533_cjs.InstrumentClass; }
});
Object.defineProperty(exports, "OTLPStorageExporter", {
  enumerable: true,
  get: function () { return chunkEDBJG533_cjs.OTLPTraceExporter; }
});
Object.defineProperty(exports, "Telemetry", {
  enumerable: true,
  get: function () { return chunkEDBJG533_cjs.Telemetry; }
});
Object.defineProperty(exports, "hasActiveTelemetry", {
  enumerable: true,
  get: function () { return chunkEDBJG533_cjs.hasActiveTelemetry; }
});
Object.defineProperty(exports, "withSpan", {
  enumerable: true,
  get: function () { return chunkEDBJG533_cjs.withSpan; }
});
Object.defineProperty(exports, "checkEvalStorageFields", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.checkEvalStorageFields; }
});
Object.defineProperty(exports, "createMastraProxy", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.createMastraProxy; }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.deepMerge; }
});
Object.defineProperty(exports, "delay", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.delay; }
});
Object.defineProperty(exports, "ensureAllMessagesAreCoreMessages", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.ensureAllMessagesAreCoreMessages; }
});
Object.defineProperty(exports, "ensureToolProperties", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.ensureToolProperties; }
});
Object.defineProperty(exports, "isVercelTool", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.isVercelTool; }
});
Object.defineProperty(exports, "jsonSchemaPropertiesToTSTypes", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.jsonSchemaPropertiesToTSTypes; }
});
Object.defineProperty(exports, "jsonSchemaToModel", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.jsonSchemaToModel; }
});
Object.defineProperty(exports, "makeCoreTool", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.makeCoreTool; }
});
Object.defineProperty(exports, "maskStreamTags", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.maskStreamTags; }
});
Object.defineProperty(exports, "resolveSerializedZodOutput", {
  enumerable: true,
  get: function () { return chunk5FAJ6HUC_cjs.resolveSerializedZodOutput; }
});
Object.defineProperty(exports, "createTool", {
  enumerable: true,
  get: function () { return chunk2W2GYEYQ_cjs.createTool; }
});
Object.defineProperty(exports, "LogLevel", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.LogLevel; }
});
Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.Logger; }
});
Object.defineProperty(exports, "LoggerTransport", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.LoggerTransport; }
});
Object.defineProperty(exports, "MultiLogger", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.MultiLogger; }
});
Object.defineProperty(exports, "RegisteredLogger", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.RegisteredLogger; }
});
Object.defineProperty(exports, "combineLoggers", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.combineLoggers; }
});
Object.defineProperty(exports, "noopLogger", {
  enumerable: true,
  get: function () { return chunkCGUKSEPG_cjs.noopLogger; }
});
Object.defineProperty(exports, "Metric", {
  enumerable: true,
  get: function () { return chunkV5ORZPFW_cjs.Metric; }
});
Object.defineProperty(exports, "evaluate", {
  enumerable: true,
  get: function () { return chunkV5ORZPFW_cjs.evaluate; }
});
Object.defineProperty(exports, "AvailableHooks", {
  enumerable: true,
  get: function () { return chunkST5RMVLG_cjs.AvailableHooks; }
});
Object.defineProperty(exports, "executeHook", {
  enumerable: true,
  get: function () { return chunkST5RMVLG_cjs.executeHook; }
});
Object.defineProperty(exports, "registerHook", {
  enumerable: true,
  get: function () { return chunkST5RMVLG_cjs.registerHook; }
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
