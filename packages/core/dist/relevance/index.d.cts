import { az as MastraLanguageModel } from '../base-N5q5S7z6.cjs';
import 'ai';
import '../base-D_N8PfP5.cjs';
import '@opentelemetry/api';
import '../index-BXwGr3N7.cjs';
import 'stream';
import '@opentelemetry/sdk-trace-base';
import '../types-CwTG2XyQ.cjs';
import 'sift';
import 'zod';
import 'json-schema';
import 'xstate';
import 'events';
import '../vector/index.cjs';
import '../vector/filter/index.cjs';
import '../tts/index.cjs';

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
