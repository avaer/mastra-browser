'use strict';

var chunkLV5CPU2X_cjs = require('./chunk-LV5CPU2X.cjs');
var chunk7D636BPD_cjs = require('./chunk-7D636BPD.cjs');
var cohereAi = require('cohere-ai');

var _CohereRelevanceScorer = class _CohereRelevanceScorer {
  constructor(model, apiKey) {
    chunk7D636BPD_cjs.__publicField(this, "client");
    chunk7D636BPD_cjs.__publicField(this, "model");
    this.client = new cohereAi.CohereClient({
      token: apiKey || process.env.COHERE_API_KEY || ""
    });
    this.model = model;
  }
  async getRelevanceScore(query, text) {
    const response = await this.client.rerank({
      query,
      documents: [text],
      model: this.model,
      topN: 1
    });
    return response.results[0].relevanceScore;
  }
};
chunk7D636BPD_cjs.__name(_CohereRelevanceScorer, "CohereRelevanceScorer");
var CohereRelevanceScorer = _CohereRelevanceScorer;

// src/relevance/relevance-score-provider.ts
function createSimilarityPrompt(query, text) {
  return `Rate the semantic similarity between the following the query and the text on a scale from 0 to 1 (decimals allowed), where 1 means exactly the same meaning and 0 means completely different:

Query: ${query}

Text: ${text}

Relevance score (0-1):`;
}
chunk7D636BPD_cjs.__name(createSimilarityPrompt, "createSimilarityPrompt");

// src/relevance/mastra-agent/index.ts
var _MastraAgentRelevanceScorer = class _MastraAgentRelevanceScorer {
  constructor(name, model) {
    chunk7D636BPD_cjs.__publicField(this, "agent");
    this.agent = new chunkLV5CPU2X_cjs.Agent({
      name: `Relevance Scorer ${name}`,
      instructions: `You are a specialized agent for evaluating the relevance of text to queries.
Your task is to rate how well a text passage answers a given query.
Output only a number between 0 and 1, where:
1.0 = Perfectly relevant, directly answers the query
0.0 = Completely irrelevant
Consider:
- Direct relevance to the question
- Completeness of information
- Quality and specificity
Always return just the number, no explanation.`,
      model
    });
  }
  async getRelevanceScore(query, text) {
    const prompt = createSimilarityPrompt(query, text);
    const response = await this.agent.generate(prompt);
    return parseFloat(response.text);
  }
};
chunk7D636BPD_cjs.__name(_MastraAgentRelevanceScorer, "MastraAgentRelevanceScorer");
var MastraAgentRelevanceScorer = _MastraAgentRelevanceScorer;

exports.CohereRelevanceScorer = CohereRelevanceScorer;
exports.MastraAgentRelevanceScorer = MastraAgentRelevanceScorer;
exports.createSimilarityPrompt = createSimilarityPrompt;
//# sourceMappingURL=chunk-BGCWUWVX.cjs.map
//# sourceMappingURL=chunk-BGCWUWVX.cjs.map