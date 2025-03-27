import { Tool } from './chunk-ZINPRHAN.js';
import { createHash } from 'crypto';
import { convertToCoreMessages } from 'ai';
import jsonSchemaToZod from 'json-schema-to-zod';
import { z } from 'zod';

var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function jsonSchemaPropertiesToTSTypes(value) {
  if (!value.type) {
    return z.object({});
  }
  if (Array.isArray(value.type)) {
    const types = value.type.map((type) => {
      return jsonSchemaPropertiesToTSTypes({ ...value, type });
    });
    return z.union(types).describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
  }
  let zodType;
  switch (value.type) {
    case "string":
      zodType = z.string().describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
      break;
    case "number":
      zodType = z.number().describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
      break;
    case "integer":
      zodType = z.number().int().describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
      break;
    case "boolean":
      zodType = z.boolean().describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
      break;
    case "array":
      zodType = z.array(jsonSchemaPropertiesToTSTypes(value.items)).describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
      break;
    case "object":
      zodType = jsonSchemaToModel(value).describe(
        (value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : "")
      );
      break;
    case "null":
      zodType = z.null().describe(value.description || "");
      break;
    default:
      throw new Error(`Unsupported JSON schema type: ${value.type}`);
  }
  return zodType;
}
function jsonSchemaToModel(jsonSchema) {
  const properties = jsonSchema.properties;
  const requiredFields = jsonSchema.required || [];
  if (!properties) {
    return z.object({});
  }
  const zodSchema = {};
  for (const [key, _] of Object.entries(properties)) {
    const value = _;
    let zodType;
    if (value.anyOf) {
      const anyOfTypes = value.anyOf.map((schema) => jsonSchemaPropertiesToTSTypes(schema));
      zodType = z.union(anyOfTypes).describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
    } else if (value.allOf) {
      const allOfTypes = value.allOf.map((schema) => jsonSchemaPropertiesToTSTypes(schema));
      zodType = z.intersection(
        allOfTypes[0],
        allOfTypes.slice(1).reduce((acc, schema) => acc.and(schema), allOfTypes[0])
      ).describe((value.description || "") + (value.examples ? `
Examples: ${value.examples.join(", ")}` : ""));
    } else {
      if (!value.type) {
        value.type = "string";
      }
      zodType = jsonSchemaPropertiesToTSTypes(value);
    }
    if (value.description) {
      zodType = zodType.describe(value.description);
    }
    const isTypeRequired = value.type === "null";
    if (requiredFields.includes(key) || isTypeRequired) {
      zodSchema[key] = zodType;
    } else {
      zodSchema[key] = zodType.nullable().optional();
    }
  }
  return z.object(zodSchema);
}
function deepMerge(target, source) {
  const output = { ...target };
  if (!source) return output;
  Object.keys(source).forEach((key) => {
    const targetValue = output[key];
    const sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = sourceValue;
    } else if (sourceValue instanceof Object && targetValue instanceof Object && !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== void 0) {
      output[key] = sourceValue;
    }
  });
  return output;
}
async function* maskStreamTags(stream, tag, options = {}) {
  const { onStart, onEnd, onMask } = options;
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  let buffer = "";
  let fullContent = "";
  let isMasking = false;
  let isBuffering = false;
  const trimOutsideDelimiter = (text, delimiter, trim) => {
    if (!text.includes(delimiter)) {
      return text;
    }
    const parts = text.split(delimiter);
    if (trim === `before-start`) {
      return `${delimiter}${parts[1]}`;
    }
    return `${parts[0]}${delimiter}`;
  };
  const startsWith = (text, pattern) => {
    if (pattern.includes(openTag.substring(0, 3))) {
      pattern = trimOutsideDelimiter(pattern, `<`, `before-start`);
    }
    return text.trim().startsWith(pattern.trim());
  };
  for await (const chunk of stream) {
    fullContent += chunk;
    if (isBuffering) buffer += chunk;
    const chunkHasTag = startsWith(chunk, openTag);
    const bufferHasTag = !chunkHasTag && isBuffering && startsWith(openTag, buffer);
    let toYieldBeforeMaskedStartTag = ``;
    if (!isMasking && (chunkHasTag || bufferHasTag)) {
      isMasking = true;
      isBuffering = false;
      const taggedTextToMask = trimOutsideDelimiter(buffer, `<`, `before-start`);
      if (taggedTextToMask !== buffer.trim()) {
        toYieldBeforeMaskedStartTag = buffer.replace(taggedTextToMask, ``);
      }
      buffer = "";
      onStart?.();
    }
    if (!isMasking && !isBuffering && startsWith(openTag, chunk) && chunk.trim() !== "") {
      isBuffering = true;
      buffer += chunk;
      continue;
    }
    if (isBuffering && buffer && !startsWith(openTag, buffer)) {
      yield buffer;
      buffer = "";
      isBuffering = false;
      continue;
    }
    if (isMasking && fullContent.includes(closeTag)) {
      onMask?.(chunk);
      onEnd?.();
      isMasking = false;
      const lastFullContent = fullContent;
      fullContent = ``;
      const textUntilEndTag = trimOutsideDelimiter(lastFullContent, closeTag, "after-end");
      if (textUntilEndTag !== lastFullContent) {
        yield lastFullContent.replace(textUntilEndTag, ``);
      }
      continue;
    }
    if (isMasking) {
      onMask?.(chunk);
      if (toYieldBeforeMaskedStartTag) {
        yield toYieldBeforeMaskedStartTag;
      }
      continue;
    }
    yield chunk;
  }
}
function resolveSerializedZodOutput(schema) {
  return Function("z", `"use strict";return (${schema});`)(z);
}
function isVercelTool(tool) {
  return !(tool instanceof Tool);
}
function createLogMessageOptions({ agentName, toolName, tool, type }) {
  if (!agentName) {
    return {
      start: `Executing tool ${toolName}`,
      error: `Failed tool execution`
    };
  }
  const prefix = `[Agent:${agentName}]`;
  const vercelPrefix = isVercelTool(tool) ? "Vercel " : "";
  const toolType = type === "toolset" ? "toolset" : "tool";
  return {
    start: `${prefix} - Executing ${vercelPrefix}${toolType} ${toolName}`,
    error: `${prefix} - Failed ${vercelPrefix}${toolType} execution`
  };
}
function createExecute(tool, options, logType) {
  const { logger, mastra: _mastra, memory: _memory, ...rest } = options;
  const { start, error } = createLogMessageOptions({
    agentName: options.agentName,
    toolName: options.name,
    tool,
    type: logType
  });
  const execFunction = async (args, execOptions) => {
    if (isVercelTool(tool)) {
      return tool?.execute?.(args, execOptions) ?? void 0;
    }
    return tool?.execute?.(
      {
        context: args,
        threadId: options.threadId,
        resourceId: options.resourceId,
        mastra: options.mastra,
        memory: options.memory,
        runId: options.runId
      },
      execOptions
    ) ?? void 0;
  };
  return async (args, execOptions) => {
    try {
      logger.debug(start, { ...rest, args });
      return await execFunction(args, execOptions);
    } catch (err) {
      logger.error(error, { ...rest, error: err, args });
      throw err;
    }
  };
}
function isZodType(value) {
  return typeof value === "object" && value !== null && "_def" in value && "parse" in value && typeof value.parse === "function" && "safeParse" in value && typeof value.safeParse === "function";
}
function createDeterministicId(input) {
  return createHash("sha256").update(input).digest("hex").slice(0, 8);
}
function setVercelToolProperties(tool) {
  const inputSchema = convertVercelToolParameters(tool);
  const toolId = !("id" in tool) ? tool.description ? `tool-${createDeterministicId(tool.description)}` : `tool-${Math.random().toString(36).substring(2, 9)}` : tool.id;
  return {
    ...tool,
    id: toolId,
    inputSchema
  };
}
function ensureToolProperties(tools) {
  const toolsWithProperties = Object.keys(tools).reduce((acc, key) => {
    const tool = tools?.[key];
    if (tool) {
      if (isVercelTool(tool)) {
        acc[key] = setVercelToolProperties(tool);
      } else {
        acc[key] = tool;
      }
    }
    return acc;
  }, {});
  return toolsWithProperties;
}
function convertVercelToolParameters(tool) {
  const schema = tool.parameters ?? z.object({});
  return isZodType(schema) ? schema : resolveSerializedZodOutput(jsonSchemaToZod(schema));
}
function makeCoreTool(tool, options, logType) {
  const getParameters = () => {
    if (isVercelTool(tool)) {
      return convertVercelToolParameters(tool);
    }
    return tool.inputSchema ?? z.object({});
  };
  const isProviderDefined = "type" in tool && tool.type === "provider-defined" && "id" in tool && typeof tool.id === "string" && tool.id.includes(".");
  if (isProviderDefined) {
    return {
      type: "provider-defined",
      id: tool.id,
      args: "args" in tool ? tool.args : {},
      description: tool.description,
      parameters: getParameters(),
      execute: tool.execute ? createExecute(tool, { ...options, description: tool.description }, logType) : void 0
    };
  }
  return {
    type: "function",
    description: tool.description,
    parameters: getParameters(),
    execute: tool.execute ? createExecute(tool, { ...options, description: tool.description }, logType) : void 0
  };
}
function createMastraProxy({ mastra, logger }) {
  return new Proxy(mastra, {
    get(target, prop) {
      const hasProp = Reflect.has(target, prop);
      if (hasProp) {
        const value = Reflect.get(target, prop);
        const isFunction = typeof value === "function";
        if (isFunction) {
          return value.bind(target);
        }
        return value;
      }
      if (prop === "logger") {
        logger.warn(`Please use 'getLogger' instead, logger is deprecated`);
        return Reflect.apply(target.getLogger, target, []);
      }
      if (prop === "telemetry") {
        logger.warn(`Please use 'getTelemetry' instead, telemetry is deprecated`);
        return Reflect.apply(target.getTelemetry, target, []);
      }
      if (prop === "storage") {
        logger.warn(`Please use 'getStorage' instead, storage is deprecated`);
        return Reflect.get(target, "storage");
      }
      if (prop === "agents") {
        logger.warn(`Please use 'getAgents' instead, agents is deprecated`);
        return Reflect.apply(target.getAgents, target, []);
      }
      if (prop === "tts") {
        logger.warn(`Please use 'getTTS' instead, tts is deprecated`);
        return Reflect.apply(target.getTTS, target, []);
      }
      if (prop === "vectors") {
        logger.warn(`Please use 'getVectors' instead, vectors is deprecated`);
        return Reflect.apply(target.getVectors, target, []);
      }
      if (prop === "memory") {
        logger.warn(`Please use 'getMemory' instead, memory is deprecated`);
        return Reflect.get(target, "memory");
      }
      return Reflect.get(target, prop);
    }
  });
}
function checkEvalStorageFields(traceObject, logger) {
  const missingFields = [];
  if (!traceObject.input) missingFields.push("input");
  if (!traceObject.output) missingFields.push("output");
  if (!traceObject.agentName) missingFields.push("agent_name");
  if (!traceObject.metricName) missingFields.push("metric_name");
  if (!traceObject.instructions) missingFields.push("instructions");
  if (!traceObject.globalRunId) missingFields.push("global_run_id");
  if (!traceObject.runId) missingFields.push("run_id");
  if (missingFields.length > 0) {
    if (logger) {
      logger.warn("Skipping evaluation storage due to missing required fields", {
        missingFields,
        runId: traceObject.runId,
        agentName: traceObject.agentName
      });
    } else {
      console.warn("Skipping evaluation storage due to missing required fields", {
        missingFields,
        runId: traceObject.runId,
        agentName: traceObject.agentName
      });
    }
    return false;
  }
  return true;
}
function detectSingleMessageCharacteristics(message) {
  if (typeof message === "object" && message !== null && (message.role === "function" || // UI-only role
  message.role === "data" || // UI-only role
  "toolInvocations" in message || // UI-specific field
  "parts" in message || // UI-specific field
  "experimental_attachments" in message)) {
    return "has-ui-specific-parts";
  } else if (typeof message === "object" && message !== null && "content" in message && (Array.isArray(message.content) || // Core messages can have array content
  "experimental_providerMetadata" in message || "providerOptions" in message)) {
    return "has-core-specific-parts";
  } else if (typeof message === "object" && message !== null && "role" in message && "content" in message && typeof message.content === "string" && ["system", "user", "assistant", "tool"].includes(message.role)) {
    return "message";
  } else {
    return "other";
  }
}
function isUiMessage(message) {
  return detectSingleMessageCharacteristics(message) === `has-ui-specific-parts`;
}
function isCoreMessage(message) {
  return [`has-core-specific-parts`, `message`].includes(detectSingleMessageCharacteristics(message));
}
function ensureAllMessagesAreCoreMessages(messages) {
  return messages.map((message) => {
    if (isUiMessage(message)) {
      return convertToCoreMessages([message]);
    }
    if (isCoreMessage(message)) {
      return message;
    }
    const characteristics = detectSingleMessageCharacteristics(message);
    throw new Error(
      `Message does not appear to be a core message or a UI message but must be one of the two, found "${characteristics}" type for message:

${JSON.stringify(message, null, 2)}
`
    );
  }).flat();
}

export { checkEvalStorageFields, createMastraProxy, deepMerge, delay, ensureAllMessagesAreCoreMessages, ensureToolProperties, isVercelTool, jsonSchemaPropertiesToTSTypes, jsonSchemaToModel, makeCoreTool, maskStreamTags, resolveSerializedZodOutput };
