import { MastraVoice } from '@mastra/core/voice';
import OpenAI from 'openai';

export declare interface OpenAIConfig {
    baseURL?: string;
    name?: OpenAIModel;
    apiKey?: string;
}

declare type OpenAIModel = 'tts-1' | 'tts-1-hd' | 'whisper-1';

export declare class OpenAIVoice extends MastraVoice {
    speechClient?: OpenAI;
    listeningClient?: OpenAI;
    /**
     * Constructs an instance of OpenAIVoice with optional configurations for speech and listening models.
     *
     * @param {Object} [config] - Configuration options for the OpenAIVoice instance.
     * @param {OpenAIConfig} [config.listeningModel] - Configuration for the listening model, including model name and API key.
     * @param {OpenAIConfig} [config.speechModel] - Configuration for the speech model, including model name and API key.
     * @param {string} [config.speaker] - The default speaker's voice to use for speech synthesis.
     * @throws {Error} - Throws an error if no API key is provided for either the speech or listening model.
     */
    constructor({ listeningModel, speechModel, speaker, }?: {
        listeningModel?: OpenAIConfig;
        speechModel?: OpenAIConfig;
        speaker?: string;
    });
    /**
     * Retrieves a list of available speakers for the speech model.
     *
     * @returns {Promise<Array<{ voiceId: OpenAIVoiceId }>>} - A promise that resolves to an array of objects,
     * each containing a `voiceId` representing an available speaker.
     * @throws {Error} - Throws an error if the speech model is not configured.
     */
    getSpeakers(): Promise<Array<{
        voiceId: OpenAIVoiceId;
    }>>;
    /**
     * Converts text or audio input into speech using the configured speech model.
     *
     * @param {string | NodeJS.ReadableStream} input - The text or audio stream to be converted into speech.
     * @param {Object} [options] - Optional parameters for the speech synthesis.
     * @param {string} [options.speaker] - The speaker's voice to use for the speech synthesis.
     * @param {number} [options.speed] - The speed at which the speech should be synthesized.
     * @returns {Promise<NodeJS.ReadableStream>} - A promise that resolves to a readable stream of the synthesized audio.
     * @throws {Error} - Throws an error if the speech model is not configured or if the input text is empty.
     */
    speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
        speed?: number;
        [key: string]: any;
    }): Promise<NodeJS.ReadableStream>;
    /**
     * Transcribes audio from a given stream using the configured listening model.
     *
     * @param {NodeJS.ReadableStream} audioStream - The audio stream to be transcribed.
     * @param {Object} [options] - Optional parameters for the transcription.
     * @param {string} [options.filetype] - The file type of the audio stream.
     *                                      Supported types include 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'.
     * @returns {Promise<string>} - A promise that resolves to the transcribed text.
     * @throws {Error} - Throws an error if the listening model is not configured.
     */
    listen(audioStream: NodeJS.ReadableStream, options?: {
        filetype?: 'mp3' | 'mp4' | 'mpeg' | 'mpga' | 'm4a' | 'wav' | 'webm';
        [key: string]: any;
    }): Promise<string>;
}

export declare interface OpenAIVoiceConfig {
    speech?: {
        model: 'tts-1' | 'tts-1-hd';
        apiKey?: string;
        speaker?: OpenAIVoiceId;
    };
    listening?: {
        model: 'whisper-1';
        apiKey?: string;
    };
}

declare type OpenAIVoiceId = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'ash' | 'coral' | 'sage';

export { }
