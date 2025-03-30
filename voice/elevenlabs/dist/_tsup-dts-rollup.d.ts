import { MastraVoice } from '@mastra/core/voice';

declare type ElevenLabsListenOptions = SpeechToTextOptions & RequestOptions;

declare type ElevenLabsModel = 'eleven_multilingual_v2' | 'eleven_flash_v2_5' | 'eleven_flash_v2' | 'eleven_multilingual_sts_v2' | 'eleven_english_sts_v2' | 'scribe_v1';

export declare class ElevenLabsVoice extends MastraVoice {
    private client;
    /**
     * Creates an instance of the ElevenLabsVoice class.
     *
     * @param {Object} options - The options for the voice configuration.
     * @param {ElevenLabsVoiceConfig} [options.speechModel] - The configuration for the speech model, including the model name and API key.
     * @param {string} [options.speaker] - The ID of the speaker to use. If not provided, a default speaker will be used.
     *
     * @throws {Error} If the ELEVENLABS_API_KEY is not set in the environment variables.
     */
    constructor({ speechModel, listeningModel, speaker, }?: {
        speechModel?: ElevenLabsVoiceConfig;
        listeningModel?: ElevenLabsVoiceConfig;
        speaker?: string;
    });
    /**
     * Retrieves a list of available speakers from the Eleven Labs API.
     * Each speaker includes their ID, name, language, and gender.
     *
     * @returns {Promise<Array<{ voiceId: string, name: string, language: string, gender: string }>>}
     * A promise that resolves to an array of speaker objects.
     */
    getSpeakers(): Promise<{
        voiceId: string;
        name: string | undefined;
        language: string;
        gender: string;
    }[]>;
    private streamToString;
    /**
     * Converts text or audio input into speech using the Eleven Labs API.
     *
     * @param {string | NodeJS.ReadableStream} input - The text to be converted to speech or a stream containing audio data.
     * @param {Object} [options] - Optional parameters for the speech generation.
     * @param {string} [options.speaker] - The ID of the speaker to use for the speech. If not provided, the default speaker will be used.
     *
     * @returns {Promise<NodeJS.ReadableStream>} A promise that resolves to a readable stream of the generated speech.
     *
     * @throws {Error} If no speaker is specified or if no speech model is set.
     */
    speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
    }): Promise<NodeJS.ReadableStream>;
    /**
     * Converts audio input to text using ElevenLabs Speech-to-Text API.
     *
     * @param input - A readable stream containing the audio data to transcribe
     * @param options - Configuration options for the transcription
     * @param options.language_code - ISO language code (e.g., 'en', 'fr', 'es')
     * @param options.tag_audio_events - Whether to tag audio events like [MUSIC], [LAUGHTER], etc.
     * @param options.num_speakers - Number of speakers to detect in the audio
     * @param options.filetype - Audio file format (e.g., 'mp3', 'wav', 'ogg')
     * @param options.timeoutInSeconds - Request timeout in seconds
     * @param options.maxRetries - Maximum number of retry attempts
     * @param options.abortSignal - Signal to abort the request
     *
     * @returns A Promise that resolves to the transcribed text
     *
     */
    listen(input: NodeJS.ReadableStream, options?: ElevenLabsListenOptions): Promise<string>;
}

declare interface ElevenLabsVoiceConfig {
    baseURL?: string;
    name?: ElevenLabsModel;
    apiKey?: string;
}

declare interface RequestOptions {
    timeoutInSeconds?: number;
    maxRetries?: number;
    abortSignal?: AbortSignal;
    apiKey?: string | undefined;
    headers?: Record<string, string>;
}

declare interface SpeechToTextOptions {
    language_code?: string;
    tag_audio_events?: boolean;
    num_speakers?: number;
    filetype?: string;
}

export { }
