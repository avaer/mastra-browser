import { BaseFilterTranslator } from './chunk-W3JW2AUS.js';
import { MastraVector } from './chunk-I4XYJ73M.js';
import { DefaultProxyStorage } from './chunk-BTX6PTDN.js';
import { deepMerge } from './chunk-HXRGB7YQ.js';
import { MastraBase } from './chunk-LE72NI7K.js';
import { __name, __publicField } from './chunk-WH5OY6PO.js';
import { isAbsolute, join, resolve } from 'path';
import { PGlite, MemoryFS } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';

// src/vector/pglite/filter.ts
var _PGliteFilterTranslator = class _PGliteFilterTranslator extends BaseFilterTranslator {
  getSupportedOperators() {
    return {
      ...BaseFilterTranslator.DEFAULT_OPERATORS,
      regex: [],
      custom: ["$contains", "$size"]
    };
  }
  translate(filter) {
    if (this.isEmpty(filter)) {
      return filter;
    }
    this.validateFilter(filter);
    return this.translateNode(filter);
  }
  translateNode(node, currentPath = "") {
    if (this.isRegex(node)) {
      throw new Error("Direct regex pattern format is not supported in PGlite");
    }
    const withPath = /* @__PURE__ */ __name((result2) => currentPath ? { [currentPath]: result2 } : result2, "withPath");
    if (this.isPrimitive(node)) {
      return withPath({ $eq: this.normalizeComparisonValue(node) });
    }
    if (Array.isArray(node)) {
      return withPath({ $in: this.normalizeArrayValues(node) });
    }
    const entries = Object.entries(node);
    const result = {};
    for (const [key, value] of entries) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      if (this.isLogicalOperator(key)) {
        result[key] = Array.isArray(value) ? value.map((filter) => this.translateNode(filter)) : this.translateNode(value);
      } else if (this.isOperator(key)) {
        if (this.isArrayOperator(key) && !Array.isArray(value) && key !== "$elemMatch") {
          result[key] = [value];
        } else if (this.isBasicOperator(key) && Array.isArray(value)) {
          result[key] = JSON.stringify(value);
        } else {
          result[key] = value;
        }
      } else if (typeof value === "object" && value !== null) {
        const hasOperators = Object.keys(value).some((k) => this.isOperator(k));
        if (hasOperators) {
          result[newPath] = this.translateNode(value);
        } else {
          Object.assign(result, this.translateNode(value, newPath));
        }
      } else {
        result[newPath] = this.translateNode(value);
      }
    }
    return result;
  }
};
__name(_PGliteFilterTranslator, "PGliteFilterTranslator");
var PGliteFilterTranslator = _PGliteFilterTranslator;

// src/vector/pglite/sql-builder.ts
var createBasicOperator = /* @__PURE__ */ __name((symbol) => {
  return (key) => ({
    sql: `CASE 
      WHEN $1 IS NULL THEN metadata->>'${handleKey(key)}' IS ${symbol === "=" ? "" : "NOT"} NULL
      ELSE metadata->>'${handleKey(key)}' ${symbol} $1
    END`,
    needsValue: true
  });
}, "createBasicOperator");
var createNumericOperator = /* @__PURE__ */ __name((symbol) => {
  return (key) => ({
    sql: `CAST(metadata->>'${handleKey(key)}' AS NUMERIC) ${symbol} $1`,
    needsValue: true
  });
}, "createNumericOperator");
var validateJsonArray = /* @__PURE__ */ __name((key) => `jsonb_typeof(metadata->'${handleKey(key)}') = 'array'`, "validateJsonArray");
var FILTER_OPERATORS = {
  $eq: createBasicOperator("="),
  $ne: createBasicOperator("!="),
  $gt: createNumericOperator(">"),
  $gte: createNumericOperator(">="),
  $lt: createNumericOperator("<"),
  $lte: createNumericOperator("<="),
  // Array Operators
  $in: /* @__PURE__ */ __name((key, value) => ({
    sql: `metadata->>'${handleKey(key)}' IN (${value.map((_, i) => `$${i + 1}`).join(",")})`,
    needsValue: true
  }), "$in"),
  $nin: /* @__PURE__ */ __name((key, value) => ({
    sql: `metadata->>'${handleKey(key)}' NOT IN (${value.map((_, i) => `$${i + 1}`).join(",")})`,
    needsValue: true
  }), "$nin"),
  $all: /* @__PURE__ */ __name((key) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: /* @__PURE__ */ __name((value) => {
      const arrayValue = Array.isArray(value) ? value : [value];
      if (arrayValue.length === 0) {
        return {
          sql: "1 = 0",
          values: []
        };
      }
      return {
        sql: `(
          CASE
            WHEN ${validateJsonArray(key)} THEN
                NOT EXISTS (
                    SELECT value 
                    FROM jsonb_array_elements_text($1::jsonb) 
                    WHERE value::text NOT IN (
                    SELECT value::text 
                    FROM jsonb_array_elements_text(metadata->'${handleKey(key)}')
                )
            )
            ELSE FALSE
          END
        )`,
        values: [JSON.stringify(arrayValue)]
      };
    }, "transformValue")
  }), "$all"),
  $elemMatch: /* @__PURE__ */ __name((key) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: /* @__PURE__ */ __name((value) => {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error("$elemMatch requires an object with conditions");
      }
      const conditions = Object.entries(value).map(([field, fieldValue]) => {
        if (field.startsWith("$")) {
          const { sql, values } = buildCondition("elem.value", { [field]: fieldValue });
          const pattern = /metadata->>'[^']*'/g;
          const elemSql = sql.replace(pattern, "elem.value");
          return { sql: elemSql, values };
        } else if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
          const { sql, values } = buildCondition(field, fieldValue);
          const pattern = /metadata->>'[^']*'/g;
          const elemSql = sql.replace(pattern, `elem.value->>'${field}'`);
          return { sql: elemSql, values };
        } else {
          return {
            sql: `elem.value->>'${field}' = $1`,
            values: [fieldValue]
          };
        }
      });
      return {
        sql: `(
          CASE
            WHEN ${validateJsonArray(key)} THEN
              EXISTS (
                SELECT 1 
                FROM jsonb_array_elements(metadata->'${handleKey(key)}') as elem
                WHERE ${conditions.map((c) => c.sql).join(" AND ")}
              )
            ELSE FALSE
          END
        )`,
        values: conditions.flatMap((c) => c.values)
      };
    }, "transformValue")
  }), "$elemMatch"),
  // Element Operators
  $exists: /* @__PURE__ */ __name((key) => ({
    sql: `metadata ? '${handleKey(key)}'`,
    needsValue: false
  }), "$exists"),
  // Logical Operators
  $and: /* @__PURE__ */ __name((key) => ({
    sql: `(${key})`,
    needsValue: false
  }), "$and"),
  $or: /* @__PURE__ */ __name((key) => ({
    sql: `(${key})`,
    needsValue: false
  }), "$or"),
  $not: /* @__PURE__ */ __name((key) => ({ sql: `NOT (${key})`, needsValue: false }), "$not"),
  $nor: /* @__PURE__ */ __name((key) => ({
    sql: `NOT (${key})`,
    needsValue: false
  }), "$nor"),
  $size: /* @__PURE__ */ __name((key) => ({
    sql: `(
    CASE
      WHEN jsonb_typeof(metadata->'${handleKey(key)}') = 'array' THEN 
        jsonb_array_length(metadata->'${handleKey(key)}') = $1
      ELSE FALSE
    END
  )`,
    needsValue: true
  }), "$size"),
  $contains: /* @__PURE__ */ __name((key) => ({
    sql: `metadata->>'${handleKey(key)}' = $1`,
    needsValue: true,
    transformValue: /* @__PURE__ */ __name((value) => {
      if (Array.isArray(value)) {
        return {
          sql: `(
            SELECT ${validateJsonArray(key)}
            AND EXISTS (
              SELECT 1 
              FROM jsonb_array_elements(metadata->'${handleKey(key)}') as m
              WHERE m.value IN (SELECT value FROM jsonb_array_elements($1::jsonb))
            )
          )`,
          values: [JSON.stringify(value)]
        };
      }
      if (value && typeof value === "object") {
        let traverse2 = function(obj, path = []) {
          for (const [k, v] of Object.entries(obj)) {
            const currentPath = [...path, k];
            if (v && typeof v === "object" && !Array.isArray(v)) {
              traverse2(v, currentPath);
            } else {
              paths.push(currentPath.join("->"));
              values.push(v);
            }
          }
        };
        __name(traverse2, "traverse");
        const paths = [];
        const values = [];
        traverse2(value);
        return {
          sql: `(${paths.map((path, i) => `metadata->'${handleKey(key)}'->>'${path}' = $${i + 1}`).join(" AND ")})`,
          values
        };
      }
      return value;
    }, "transformValue")
  }), "$contains")
};
var handleKey = /* @__PURE__ */ __name((key) => {
  return key.replace(/\./g, "->>");
}, "handleKey");
function buildFilterQuery(filter) {
  if (!filter) {
    return { sql: "", values: [] };
  }
  const values = [];
  const conditions = Object.entries(filter).map(([key, value]) => {
    const condition = buildCondition(key, value);
    values.push(...condition.values);
    return condition.sql;
  }).join(" AND ");
  return {
    sql: conditions ? `WHERE ${conditions}` : "",
    values
  };
}
__name(buildFilterQuery, "buildFilterQuery");
function buildCondition(key, value, parentPath) {
  if (["$and", "$or", "$not", "$nor"].includes(key)) {
    return handleLogicalOperator(key, value);
  }
  if (!value || typeof value !== "object") {
    return {
      sql: `metadata->>'${key}' = $1`,
      values: [value]
    };
  }
  return handleOperator(key, value);
}
__name(buildCondition, "buildCondition");
function handleLogicalOperator(key, value, parentPath) {
  if (!value || value.length === 0) {
    switch (key) {
      case "$and":
      case "$nor":
        return { sql: "true", values: [] };
      case "$or":
        return { sql: "false", values: [] };
      case "$not":
        throw new Error("$not operator cannot be empty");
      default:
        return { sql: "true", values: [] };
    }
  }
  if (key === "$not") {
    const entries = Object.entries(value);
    const conditions2 = entries.map(([fieldKey, fieldValue]) => buildCondition(fieldKey, fieldValue));
    return {
      sql: `NOT (${conditions2.map((c) => c.sql).join(" AND ")})`,
      values: conditions2.flatMap((c) => c.values)
    };
  }
  const values = [];
  const joinOperator = key === "$or" || key === "$nor" ? "OR" : "AND";
  const conditions = Array.isArray(value) ? value.map((f) => {
    const entries = Object.entries(f);
    return entries.map(([k, v]) => buildCondition(k, v));
  }) : [buildCondition(key, value)];
  const joined = conditions.flat().map((c) => {
    values.push(...c.values);
    return c.sql;
  }).join(` ${joinOperator} `);
  return {
    sql: key === "$nor" ? `NOT (${joined})` : `(${joined})`,
    values
  };
}
__name(handleLogicalOperator, "handleLogicalOperator");
function handleOperator(key, value) {
  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    const results = entries.map(
      ([operator2, operatorValue2]) => operator2 === "$not" ? {
        sql: `NOT (${Object.entries(operatorValue2).map(([op, val]) => processOperator(key, op, val).sql).join(" AND ")})`,
        values: Object.entries(operatorValue2).flatMap(
          ([op, val]) => processOperator(key, op, val).values
        )
      } : processOperator(key, operator2, operatorValue2)
    );
    return {
      sql: `(${results.map((r) => r.sql).join(" AND ")})`,
      values: results.flatMap((r) => r.values)
    };
  }
  const [[operator, operatorValue] = []] = Object.entries(value);
  return processOperator(key, operator, operatorValue);
}
__name(handleOperator, "handleOperator");
var processOperator = /* @__PURE__ */ __name((key, operator, operatorValue) => {
  if (!operator.startsWith("$") || !FILTER_OPERATORS[operator]) {
    throw new Error(`Invalid operator: ${operator}`);
  }
  const operatorFn = FILTER_OPERATORS[operator];
  const operatorResult = operatorFn(key, operatorValue);
  if (!operatorResult.needsValue) {
    return { sql: operatorResult.sql, values: [] };
  }
  const transformed = operatorResult.transformValue ? operatorResult.transformValue(operatorValue) : operatorValue;
  if (transformed && typeof transformed === "object" && "sql" in transformed) {
    return transformed;
  }
  return {
    sql: operatorResult.sql,
    values: Array.isArray(transformed) ? transformed : [transformed]
  };
}, "processOperator");

// src/vector/pglite/index.ts
var _PGliteVector = class _PGliteVector extends MastraVector {
  constructor({
    connectionUrl,
    authToken,
    syncUrl,
    syncInterval
  }) {
    super();
    __publicField(this, "client", null);
    __publicField(this, "clientPromise", null);
    this.clientPromise = this.initClient(connectionUrl);
  }
  async initClient(connectionUrl) {
    try {
      const client = await PGlite.create(this.rewriteDbUrl(connectionUrl), {
        fs: new MemoryFS(),
        extensions: {
          vector
          // Enable pgvector support
        }
      });
      this.client = client;
      return client;
    } catch (error) {
      this.logger.error(`Error initializing PGlite client: ${error}`);
      throw error;
    }
  }
  // If we're in the .mastra/output directory, use the dir outside .mastra dir
  rewriteDbUrl(url) {
    if (url.startsWith("file:") && url !== "file::memory:") {
      const pathPart = url.slice("file:".length);
      if (isAbsolute(pathPart)) {
        return url;
      }
      const cwd = process.cwd();
      if (cwd.includes(".mastra") && (cwd.endsWith(`output`) || cwd.endsWith(`output/`) || cwd.endsWith(`output\\`))) {
        const baseDir = join(cwd, `..`, `..`);
        const fullPath = resolve(baseDir, pathPart);
        this.logger.debug(
          `Initializing PGlite db with url ${url} with relative file path from inside .mastra/output directory. Rewriting relative file url to "file:${fullPath}". This ensures it's outside the .mastra/output directory.`
        );
        return `file:${fullPath}`;
      }
    }
    return url;
  }
  async getClient() {
    if (!this.client && this.clientPromise) {
      this.client = await this.clientPromise;
    }
    if (!this.client) {
      throw new Error("PGlite client not initialized");
    }
    return this.client;
  }
  transformFilter(filter) {
    const translator = new PGliteFilterTranslator();
    return translator.translate(filter);
  }
  async query(...args) {
    const params = this.normalizeArgs("query", args, ["minScore"]);
    try {
      const { indexName, queryVector, topK = 10, filter, includeVector = false, minScore = 0 } = params;
      const client = await this.getClient();
      const vectorLiteral = `[${queryVector.join(",")}]`;
      const translatedFilter = this.transformFilter(filter);
      const { sql: filterQuery, values: filterValues } = buildFilterQuery(translatedFilter);
      const scoreParamIndex = filterValues.length + 1;
      const queryParams = [...filterValues, minScore];
      const query = `
        WITH vector_scores AS (
          SELECT
            vector_id as id,
            1 - (embedding <=> '${vectorLiteral}'::vector) as score,
            metadata
            ${includeVector ? ", embedding::float4[] as vector" : ""}
          FROM ${indexName}
          ${filterQuery}
        )
        SELECT *
        FROM vector_scores
        WHERE score > $${scoreParamIndex}
        ORDER BY score DESC
        LIMIT ${topK}`;
      const result = await client.query(query, queryParams);
      return (result.rows || []).map((row) => {
        const { id, score, metadata, vector: vector2 } = row;
        return {
          id,
          score,
          metadata: typeof metadata === "string" ? JSON.parse(metadata) : metadata,
          ...includeVector && vector2 && { vector: vector2 }
        };
      });
    } catch (error) {
      this.logger.error(`Error querying vectors: ${error}`);
      throw error;
    }
  }
  async upsert(...args) {
    const params = this.normalizeArgs("upsert", args);
    const { indexName, vectors, metadata, ids } = params;
    const client = await this.getClient();
    try {
      const vectorIds = ids || vectors.map(() => crypto.randomUUID());
      await client.transaction(async (tx) => {
        for (let i = 0; i < vectors.length; i++) {
          const vectorLiteral = `[${vectors[i].join(",")}]`;
          const metadataJson = JSON.stringify(metadata?.[i] || {});
          await tx.query(
            `INSERT INTO ${indexName} (vector_id, embedding, metadata)
            VALUES ($1, $2::vector, $3::jsonb)
            ON CONFLICT(vector_id) DO UPDATE SET
              embedding = $2::vector,
              metadata = $3::jsonb`,
            [vectorIds[i], vectorLiteral, metadataJson]
          );
        }
      });
      return vectorIds;
    } catch (error) {
      this.logger.error(`Error upserting vectors: ${error}`);
      throw error;
    }
  }
  async createIndex(...args) {
    const params = this.normalizeArgs("createIndex", args);
    const { indexName, dimension, metric = "cosine" } = params;
    try {
      if (!indexName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        throw new Error("Invalid index name format");
      }
      if (!Number.isInteger(dimension) || dimension <= 0) {
        throw new Error("Dimension must be a positive integer");
      }
      const client = await this.getClient();
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${indexName} (
          id SERIAL PRIMARY KEY,
          vector_id TEXT UNIQUE NOT NULL,
          embedding vector(${dimension}) NOT NULL,
          metadata JSONB DEFAULT '{}'::jsonb
        )
      `);
      let operator = "";
      switch (metric) {
        case "cosine":
          operator = "vector_cosine_ops";
          break;
        case "euclidean":
          operator = "vector_l2_ops";
          break;
        case "dotproduct":
          operator = "vector_ip_ops";
          break;
        default:
          operator = "vector_cosine_ops";
      }
      await client.query(`
        CREATE INDEX IF NOT EXISTS ${indexName}_vector_idx
        ON ${indexName} USING hnsw (embedding ${operator})
      `);
    } catch (error) {
      this.logger.error(`Failed to create vector table: ${error}`);
      throw error;
    }
  }
  async deleteIndex(indexName) {
    try {
      const client = await this.getClient();
      await client.query(`DROP TABLE IF EXISTS ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to delete vector table: ${error}`);
      throw error;
    }
  }
  async listIndexes() {
    try {
      const client = await this.getClient();
      const vectorTablesQuery = `
        SELECT tablename FROM pg_tables 
        WHERE tablename IN (
          SELECT table_name 
          FROM information_schema.columns 
          WHERE data_type = 'USER-DEFINED' AND udt_name = 'vector'
        )
      `;
      const result = await client.query(vectorTablesQuery);
      return (result.rows || []).map((row) => row.tablename);
    } catch (error) {
      this.logger.error(`Failed to list vector tables: ${error}`);
      throw error;
    }
  }
  async describeIndex(indexName) {
    try {
      const client = await this.getClient();
      const dimensionQuery = `
        SELECT a.atttypmod as dimension
        FROM pg_attribute a
        JOIN pg_class c ON a.attrelid = c.oid
        WHERE c.relname = $1 AND a.attname = 'embedding'
      `;
      const dimensionResult = await client.query(dimensionQuery, [indexName]);
      const dimensionRow = dimensionResult.rows?.[0];
      const dimension = dimensionRow?.dimension || 0;
      const countQuery = `SELECT COUNT(*) as count FROM ${indexName}`;
      const countResult = await client.query(countQuery);
      const countRow = countResult.rows?.[0];
      const count = countRow?.count || 0;
      const metricQuery = `
        SELECT amname, opcname
        FROM pg_index i
        JOIN pg_class c ON i.indexrelid = c.oid
        JOIN pg_opclass op ON i.indclass[0] = op.oid
        JOIN pg_am am ON op.opcmethod = am.oid
        WHERE c.relname LIKE $1 || '%'
      `;
      const metricResult = await client.query(metricQuery, [indexName]);
      let metric = "cosine";
      if (metricResult.rows?.length > 0) {
        const row = metricResult.rows[0];
        const opcname = row?.opcname;
        if (opcname?.includes("l2")) {
          metric = "euclidean";
        } else if (opcname?.includes("ip")) {
          metric = "dotproduct";
        }
      }
      return {
        dimension,
        count: parseInt(count, 10),
        metric
      };
    } catch (error) {
      this.logger.error(`Failed to describe vector table: ${error}`);
      throw error;
    }
  }
  async updateIndexById(indexName, id, update) {
    try {
      const client = await this.getClient();
      const updates = [];
      const values = [id];
      let paramIndex = 2;
      if (update.vector) {
        const vectorLiteral = `[${update.vector.join(",")}]`;
        updates.push(`embedding = $${paramIndex}::vector`);
        values.push(vectorLiteral);
        paramIndex++;
      }
      if (update.metadata) {
        updates.push(`metadata = $${paramIndex}::jsonb`);
        values.push(JSON.stringify(update.metadata));
        paramIndex++;
      }
      if (updates.length === 0) {
        throw new Error("No updates provided");
      }
      const query = `
        UPDATE ${indexName}
        SET ${updates.join(", ")}
        WHERE vector_id = $1
      `;
      await client.query(query, values);
    } catch (error) {
      this.logger.error(`Failed to update index by id: ${id} for index: ${indexName}: ${error}`);
      throw error;
    }
  }
  async deleteIndexById(indexName, id) {
    try {
      const client = await this.getClient();
      await client.query(`DELETE FROM ${indexName} WHERE vector_id = $1`, [id]);
    } catch (error) {
      this.logger.error(`Failed to delete index by id: ${id} for index: ${indexName}: ${error}`);
      throw error;
    }
  }
  async truncateIndex(indexName) {
    try {
      const client = await this.getClient();
      await client.query(`DELETE FROM ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to truncate index: ${indexName}: ${error}`);
      throw error;
    }
  }
};
__name(_PGliteVector, "PGliteVector");
var PGliteVector = _PGliteVector;

// src/memory/memory.ts
var _MastraMemory = class _MastraMemory extends MastraBase {
  constructor(config) {
    super({ component: "MEMORY", name: config.name });
    __publicField(this, "MAX_CONTEXT_TOKENS");
    __publicField(this, "storage");
    __publicField(this, "vector");
    __publicField(this, "embedder");
    __publicField(this, "threadConfig", {
      lastMessages: 40,
      semanticRecall: true,
      threads: {
        generateTitle: true
        // TODO: should we disable this by default to reduce latency?
      }
    });
    this.storage = config.storage || new DefaultProxyStorage({
      config: {
        url: "file:memory.db"
      }
    });
    if (config.vector) {
      this.vector = config.vector;
    } else {
      this.vector = new PGliteVector({
        connectionUrl: ":memory:"
      });
    }
    if (config.embedder) {
      this.embedder = config.embedder;
    } else {
      throw new Error("Embedder config is required");
    }
    if (config.options) {
      this.threadConfig = this.getMergedThreadConfig(config.options);
    }
  }
  setStorage(storage) {
    this.storage = storage;
  }
  setVector(vector2) {
    this.vector = vector2;
  }
  setEmbedder(embedder) {
    this.embedder = embedder;
  }
  /**
   * Get a system message to inject into the conversation.
   * This will be called before each conversation turn.
   * Implementations can override this to inject custom system messages.
   */
  async getSystemMessage(_input) {
    return null;
  }
  /**
   * Get tools that should be available to the agent.
   * This will be called when converting tools for the agent.
   * Implementations can override this to provide additional tools.
   */
  getTools(_config) {
    return {};
  }
  async createEmbeddingIndex() {
    const defaultDimensions = 1536;
    const dimensionsByModelId = {
      "bge-small-en-v1.5": 384,
      "bge-base-en-v1.5": 768,
      "voyage-3-lite": 512
    };
    const dimensions = dimensionsByModelId[this.embedder.modelId] || defaultDimensions;
    const isDefault = dimensions === defaultDimensions;
    const indexName = isDefault ? "memory_messages" : `memory_messages_${dimensions}`;
    await this.vector.createIndex({ indexName, dimension: dimensions });
    return { indexName };
  }
  getMergedThreadConfig(config) {
    return deepMerge(this.threadConfig, config || {});
  }
  estimateTokens(text) {
    return Math.ceil(text.split(" ").length * 1.3);
  }
  parseMessages(messages) {
    return messages.map((msg) => ({
      ...msg,
      content: typeof msg.content === "string" && (msg.content.startsWith("[") || msg.content.startsWith("{")) ? JSON.parse(msg.content) : typeof msg.content === "number" ? String(msg.content) : msg.content
    }));
  }
  convertToUIMessages(messages) {
    function addToolMessageToChat({
      toolMessage,
      messages: messages2,
      toolResultContents
    }) {
      const chatMessages2 = messages2.map((message) => {
        if (message.toolInvocations) {
          return {
            ...message,
            toolInvocations: message.toolInvocations.map((toolInvocation) => {
              const toolResult = toolMessage.content.find((tool) => tool.toolCallId === toolInvocation.toolCallId);
              if (toolResult) {
                return {
                  ...toolInvocation,
                  state: "result",
                  result: toolResult.result
                };
              }
              return toolInvocation;
            })
          };
        }
        return message;
      });
      const resultContents = [...toolResultContents, ...toolMessage.content];
      return { chatMessages: chatMessages2, toolResultContents: resultContents };
    }
    __name(addToolMessageToChat, "addToolMessageToChat");
    const { chatMessages } = messages.reduce(
      (obj, message) => {
        if (message.role === "tool") {
          return addToolMessageToChat({
            toolMessage: message,
            messages: obj.chatMessages,
            toolResultContents: obj.toolResultContents
          });
        }
        let textContent = "";
        let toolInvocations = [];
        if (typeof message.content === "string") {
          textContent = message.content;
        } else if (typeof message.content === "number") {
          textContent = String(message.content);
        } else if (Array.isArray(message.content)) {
          for (const content of message.content) {
            if (content.type === "text") {
              textContent += content.text;
            } else if (content.type === "tool-call") {
              const toolResult = obj.toolResultContents.find((tool) => tool.toolCallId === content.toolCallId);
              toolInvocations.push({
                state: toolResult ? "result" : "call",
                toolCallId: content.toolCallId,
                toolName: content.toolName,
                args: content.args,
                result: toolResult?.result
              });
            }
          }
        }
        obj.chatMessages.push({
          id: message.id,
          role: message.role,
          content: textContent,
          toolInvocations
        });
        return obj;
      },
      { chatMessages: [], toolResultContents: [] }
    );
    return chatMessages;
  }
  /**
   * Helper method to create a new thread
   * @param title - Optional title for the thread
   * @param metadata - Optional metadata for the thread
   * @returns Promise resolving to the created thread
   */
  async createThread({
    threadId,
    resourceId,
    title,
    metadata,
    memoryConfig
  }) {
    const thread = {
      id: threadId || this.generateId(),
      title: title || `New Thread ${(/* @__PURE__ */ new Date()).toISOString()}`,
      resourceId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      metadata
    };
    return this.saveThread({ thread, memoryConfig });
  }
  /**
   * Helper method to add a single message to a thread
   * @param threadId - The thread to add the message to
   * @param content - The message content
   * @param role - The role of the message sender
   * @param type - The type of the message
   * @param toolNames - Optional array of tool names that were called
   * @param toolCallArgs - Optional array of tool call arguments
   * @param toolCallIds - Optional array of tool call ids
   * @returns Promise resolving to the saved message
   */
  async addMessage({
    threadId,
    config,
    content,
    role,
    type,
    toolNames,
    toolCallArgs,
    toolCallIds
  }) {
    const message = {
      id: this.generateId(),
      content,
      role,
      createdAt: /* @__PURE__ */ new Date(),
      threadId,
      type,
      toolNames,
      toolCallArgs,
      toolCallIds
    };
    const savedMessages = await this.saveMessages({ messages: [message], memoryConfig: config });
    return savedMessages[0];
  }
  /**
   * Generates a unique identifier
   * @returns A unique string ID
   */
  generateId() {
    return crypto.randomUUID();
  }
};
__name(_MastraMemory, "MastraMemory");
var MastraMemory = _MastraMemory;

export { MastraMemory };
//# sourceMappingURL=chunk-5AWVIQA6.js.map
//# sourceMappingURL=chunk-5AWVIQA6.js.map