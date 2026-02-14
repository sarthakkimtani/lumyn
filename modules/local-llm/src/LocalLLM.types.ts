export type ModelAvailability =
  | "available"
  | "deviceNotEligible"
  | "appleIntelligenceNotEnabled"
  | "modelNotReady"
  | "unavailable"
  | "incorrectIOSVersion";

export type LocalModelAvailability = {
  available: ModelAvailability;
  osVersion: string;
};

export type TranscriptEntryRole =
  | "instructions"
  | "prompt"
  | "response"
  | "toolCalls"
  | "toolOutput";

export type TranscriptEntry = {
  id: string;
  role: TranscriptEntryRole;
  text: string;
  tool: string | null;
};

export type ModelTranscript = {
  entries: TranscriptEntry[];
};

export type LocalSessionRequest = {
  transcript?: ModelTranscript | null;
};

export type LocalSessionDetails = {
  id: string;
};

export type StreamingSession = {
  sessionId: string;
  isActive: boolean;
  error: string | null;
};

export type StreamingChunkEvent = {
  sessionId: string;
  content: string;
  isComplete: boolean;
};

export type StreamingErrorEvent = {
  sessionId: string;
  error: string;
};

export type StreamTextRequest = {
  sessionId: string;
  prompt: string;
};
