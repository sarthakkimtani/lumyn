import { useCallback, useEffect, useRef, useState } from "react";

import LocalLLMModule, {
  LocalSessionDetails,
  ModelTranscript,
  StreamingChunkEvent,
  StreamingErrorEvent,
} from "@/modules/local-llm";

export function useChat(initialTranscript: ModelTranscript | null = null) {
  const [content, setContent] = useState("");
  const [session, setSession] = useState<LocalSessionDetails | null>(null);
  const [transcript, setTranscript] = useState<ModelTranscript>(
    () => initialTranscript ?? { entries: [] },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionsRef = useRef<{ remove: () => void }[]>([]);
  const streamingSessionIdRef = useRef<string | null>(null);

  const syncTranscriptFromSession = useCallback((sessionId: string) => {
    const nativeTranscript = LocalLLMModule.getTranscript(sessionId);
    setTranscript(nativeTranscript);
  }, []);

  const createSession = useCallback(
    (hydrationTranscript: ModelTranscript) => {
      const newSession = LocalLLMModule.startSession({
        transcript: hydrationTranscript,
      });

      setSession(newSession);
      setError(null);
      syncTranscriptFromSession(newSession.id);

      return newSession;
    },
    [syncTranscriptFromSession],
  );

  const startSession = useCallback(
    (hydrationTranscript: ModelTranscript | null = null) => {
      const transcriptToHydrate = hydrationTranscript ?? transcript;
      return createSession(transcriptToHydrate);
    },
    [createSession, transcript],
  );

  useEffect(() => {
    // Set up event listeners
    const chunkSub = LocalLLMModule.addListener(
      "onStreamingChunk",
      (event: StreamingChunkEvent) => {
        // Only process events for our session
        if (event.sessionId !== streamingSessionIdRef.current) return;

        if (event.isComplete) {
          setLoading(false);
          streamingSessionIdRef.current = null;
          syncTranscriptFromSession(event.sessionId);
        } else {
          setContent(event.content);
        }
      },
    );

    const errorSub = LocalLLMModule.addListener(
      "onStreamingError",
      (event: StreamingErrorEvent) => {
        if (event.sessionId !== streamingSessionIdRef.current) return;

        setError(event.error);
        setLoading(false);
        streamingSessionIdRef.current = null;
        syncTranscriptFromSession(event.sessionId);
      },
    );

    subscriptionsRef.current = [chunkSub, errorSub];

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, [syncTranscriptFromSession]);

  const startStreaming = useCallback(
    async (prompt: string) => {
      if (loading) {
        setError("A response is already streaming");
        return;
      }

      if (!prompt.trim()) {
        setError("Prompt cannot be empty");
        return;
      }

      try {
        const trimmedPrompt = prompt.trim();
        setLoading(true);
        setError(null);
        setContent("");

        const activeSession = session ?? startSession();
        streamingSessionIdRef.current = activeSession.id;

        const streamResponse = await LocalLLMModule.streamText({
          sessionId: activeSession.id,
          prompt: trimmedPrompt,
        });

        if (streamResponse.error) {
          setError(streamResponse.error);
          setLoading(false);
          streamingSessionIdRef.current = null;
        } else {
          syncTranscriptFromSession(activeSession.id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start streaming");
        setLoading(false);
        streamingSessionIdRef.current = null;
      }
    },
    [loading, session, startSession, syncTranscriptFromSession],
  );

  const hydrateSession = useCallback(
    (hydrationTranscript: ModelTranscript) => {
      setContent("");
      setLoading(false);
      streamingSessionIdRef.current = null;

      return startSession(hydrationTranscript);
    },
    [startSession],
  );

  const reset = useCallback(() => {
    setContent("");
    setError(null);
    setSession(null);
    setTranscript({ entries: [] });
    setLoading(false);
    streamingSessionIdRef.current = null;
  }, []);

  return {
    content,
    session,
    sessionId: session?.id ?? null,
    transcript,
    loading,
    error,
    startSession,
    hydrateSession,
    startStreaming,
    reset,
  };
}
