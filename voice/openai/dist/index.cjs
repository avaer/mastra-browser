'use strict';

var stream = require('stream');
var voice = require('@mastra/core/voice');
var OpenAI = require('openai');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var OpenAI__default = /*#__PURE__*/_interopDefault(OpenAI);

// src/index.ts
var OpenAIVoice = class extends voice.MastraVoice {
  speechClient;
  listeningClient;
  /**
   * Constructs an instance of OpenAIVoice with optional configurations for speech and listening models.
   *
   * @param {Object} [config] - Configuration options for the OpenAIVoice instance.
   * @param {OpenAIConfig} [config.listeningModel] - Configuration for the listening model, including model name and API key.
   * @param {OpenAIConfig} [config.speechModel] - Configuration for the speech model, including model name and API key.
   * @param {string} [config.speaker] - The default speaker's voice to use for speech synthesis.
   * @throws {Error} - Throws an error if no API key is provided for either the speech or listening model.
   */
  constructor({
    listeningModel,
    speechModel,
    speaker
  } = {}) {
    const defaultApiKey = process.env.OPENAI_API_KEY;
    const defaultSpeechModel = {
      baseURL: speechModel?.baseURL,
      name: "tts-1",
      apiKey: defaultApiKey
    };
    const defaultListeningModel = {
      baseURL: listeningModel?.baseURL,
      name: "whisper-1",
      apiKey: defaultApiKey
    };
    super({
      speechModel: {
        baseURL: speechModel?.baseURL ?? defaultSpeechModel.baseURL,
        name: speechModel?.name ?? defaultSpeechModel.name,
        apiKey: speechModel?.apiKey ?? defaultSpeechModel.apiKey
      },
      listeningModel: {
        baseURL: listeningModel?.baseURL ?? defaultListeningModel.baseURL,
        name: listeningModel?.name ?? defaultListeningModel.name,
        apiKey: listeningModel?.apiKey ?? defaultListeningModel.apiKey
      },
      speaker: speaker ?? "alloy"
    });
    const speechBaseURL = speechModel?.baseURL ?? defaultSpeechModel.baseURL;
    const speechApiKey = speechModel?.apiKey || defaultApiKey;
    this.speechClient = speechBaseURL && speechApiKey ? new OpenAI__default.default({ apiKey: speechApiKey, baseURL: speechBaseURL, dangerouslyAllowBrowser: true }) : void 0;
    const listeningBaseURL = listeningModel?.baseURL ?? defaultListeningModel.baseURL;
    const listeningApiKey = listeningModel?.apiKey || defaultApiKey;
    this.listeningClient = listeningBaseURL && listeningApiKey ? new OpenAI__default.default({ apiKey: listeningApiKey, baseURL: listeningBaseURL, dangerouslyAllowBrowser: true }) : void 0;
    if (!this.speechClient && !this.listeningClient) {
      throw new Error("At least one of OPENAI_API_KEY, speechModel.apiKey, or listeningModel.apiKey must be set");
    }
  }
  /**
   * Retrieves a list of available speakers for the speech model.
   *
   * @returns {Promise<Array<{ voiceId: OpenAIVoiceId }>>} - A promise that resolves to an array of objects,
   * each containing a `voiceId` representing an available speaker.
   * @throws {Error} - Throws an error if the speech model is not configured.
   */
  async getSpeakers() {
    if (!this.speechModel) {
      throw new Error("Speech model not configured");
    }
    return [
      { voiceId: "alloy" },
      { voiceId: "echo" },
      { voiceId: "fable" },
      { voiceId: "onyx" },
      { voiceId: "nova" },
      { voiceId: "shimmer" },
      { voiceId: "ash" },
      { voiceId: "coral" },
      { voiceId: "sage" }
    ];
  }
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
  async speak(input, options) {
    if (!this.speechClient) {
      throw new Error("Speech model not configured");
    }
    if (typeof input !== "string") {
      const chunks = [];
      for await (const chunk of input) {
        if (typeof chunk === "string") {
          chunks.push(Buffer.from(chunk));
        } else {
          chunks.push(chunk);
        }
      }
      input = Buffer.concat(chunks).toString("utf-8");
    }
    if (input.trim().length === 0) {
      throw new Error("Input text is empty");
    }
    const audio = await this.traced(async () => {
      const response = await this.speechClient.audio.speech.create({
        model: this.speechModel?.name ?? "tts-1",
        voice: options?.speaker ?? this.speaker,
        input,
        speed: options?.speed || 1
      });
      const passThrough = new stream.PassThrough();
      const buffer = Buffer.from(await response.arrayBuffer());
      passThrough.end(buffer);
      return passThrough;
    }, "voice.openai.speak")();
    return audio;
  }
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
  async listen(audioStream, options) {
    if (!this.listeningClient) {
      throw new Error("Listening model not configured");
    }
    const chunks = [];
    for await (const chunk of audioStream) {
      if (typeof chunk === "string") {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(chunk);
      }
    }
    const audioBuffer = Buffer.concat(chunks);
    const text = await this.traced(async () => {
      const { filetype, ...otherOptions } = options || {};
      const file = new File([audioBuffer], `audio.${filetype || "mp3"}`);
      const response = await this.listeningClient.audio.transcriptions.create({
        model: this.listeningModel?.name || "whisper-1",
        file,
        ...otherOptions
      });
      return response.text;
    }, "voice.openai.listen")();
    return text;
  }
};

exports.OpenAIVoice = OpenAIVoice;
