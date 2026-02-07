export type LocalModelAvailability = {
  isAvailable: boolean;
  reason: string | null;
  osVersion: string;
};

export type TranscriptEntryRole = "prompt" | "response" | "toolCalls" | "toolOutput";

export type TranscriptEntry = {
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
