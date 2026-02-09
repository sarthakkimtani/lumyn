import { NativeModule, requireNativeModule } from "expo";

import {
  LocalModelAvailability,
  LocalSessionDetails,
  LocalSessionRequest,
  ModelTranscript,
  StreamingChunkEvent,
  StreamingErrorEvent,
  StreamingSession,
  StreamTextRequest,
} from "./LocalLLM.types";

declare class LocalLLMModule extends NativeModule {
  checkAvailability(): LocalModelAvailability;
  startSession(request: LocalSessionRequest): LocalSessionDetails;
  getTranscript(sessionId: string): ModelTranscript;
  streamText(request: StreamTextRequest): Promise<StreamingSession>;
  setSystemPrompt(prompt: string): void;

  addListener(
    eventName: "onStreamingChunk",
    listener: (event: StreamingChunkEvent) => void,
  ): { remove: () => void };
  addListener(
    eventName: "onStreamingError",
    listener: (event: StreamingErrorEvent) => void,
  ): { remove: () => void };
}

export default requireNativeModule<LocalLLMModule>("LocalLLM");
