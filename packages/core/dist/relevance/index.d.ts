import { az as MastraLanguageModel } from '../base-c12pi2Tp.js';
import 'ai';
import '../base-Dq_cxikD.js';
import '@opentelemetry/api';
import '../index-BXwGr3N7.js';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import '../types-CwTG2XyQ.js';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'node:events';
import '../vector/index.js';
import '../vector/filter/index.js';
import '../tts/index.js';
import '../deployer/index.js';
import '../bundler/index.js';

interface RelevanceScoreProvider {
    getRelevanceScore(text1: string, text2: string): Promise<number>;
}
declare function createSimilarityPrompt(query: string, text: string): string;

declare class CohereRelevanceScorer implements RelevanceScoreProvider {
    private client;
    private model;
    constructor(model: string, apiKey?: string);
    getRelevanceScore(query: string, text: string): Promise<number>;
}

declare class MastraAgentRelevanceScorer implements RelevanceScoreProvider {
    private agent;
    constructor(name: string, model: MastraLanguageModel);
    getRelevanceScore(query: string, text: string): Promise<number>;
}

export { CohereRelevanceScorer, MastraAgentRelevanceScorer, type RelevanceScoreProvider, createSimilarityPrompt };
