import { useCallback, useEffect, useRef, useState } from "react";

import { useQueries } from "@/hooks/use-queries";
import LocalLLMModule, {
  LocalSessionDetails,
  ModelTranscript,
  StreamingChunkEvent,
  StreamingErrorEvent,
} from "@/modules/local-llm";
import { getFirstWords } from "@/utils/string";

type UseChatParams = {
  conversationId?: string | null;
  initialTranscript?: ModelTranscript | null;
  temporary?: boolean;
};

export const useChat = ({
  conversationId: existingConversationId = null,
  initialTranscript = null,
  temporary = false,
}: UseChatParams = {}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<LocalSessionDetails | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(existingConversationId);

  const [transcript, setTranscript] = useState<ModelTranscript>(
    () => initialTranscript ?? { entries: [] },
  );

  const subscriptionsRef = useRef<{ remove: () => void }[]>([]);
  const streamingSessionIdRef = useRef<string | null>(null);
  const DEFAULT_CHAT_TITLE = "New Chat";

  const { upsertConversation, upsertTranscriptEntries } = useQueries();

  const persistTranscriptEntries = useCallback(
    async (dbConversationId: string, transcriptToSave: ModelTranscript) => {
      const insertEntries = transcriptToSave.entries.map((entry) => ({
        conversationId: dbConversationId,
        ...entry,
      }));

      await upsertTranscriptEntries(insertEntries);
    },
    [upsertTranscriptEntries],
  );

  const syncTranscriptFromSession = useCallback(
    async (sessionId: string, dbConversationId: string) => {
      const nativeTranscript = LocalLLMModule.getTranscript(sessionId);
      setTranscript(nativeTranscript);

      if (!temporary) {
        await persistTranscriptEntries(dbConversationId, nativeTranscript);
      }
    },
    [persistTranscriptEntries, temporary],
  );

  const createSession = async (
    hydrationTranscript: ModelTranscript,
    conversationTitle: string = DEFAULT_CHAT_TITLE,
  ) => {
    const newSession = LocalLLMModule.startSession({
      transcript: hydrationTranscript,
    });

    const dbConversationId = conversationId ?? newSession.id;

    if (!conversationId && !temporary) {
      await upsertConversation({ id: dbConversationId, title: conversationTitle });
      setConversationId(dbConversationId);
    }

    setSession(newSession);
    setError(null);

    await syncTranscriptFromSession(newSession.id, dbConversationId);

    return newSession;
  };

  const startSession = async (
    hydrationTranscript: ModelTranscript | null = null,
    conversationTitle: string = DEFAULT_CHAT_TITLE,
  ) => {
    const transcriptToHydrate = hydrationTranscript ?? transcript;
    return await createSession(transcriptToHydrate, conversationTitle);
  };

  useEffect(() => {
    const chunkSub = LocalLLMModule.addListener(
      "onStreamingChunk",
      async (event: StreamingChunkEvent) => {
        if (event.sessionId !== streamingSessionIdRef.current) return;

        if (event.isComplete) {
          setLoading(false);
          streamingSessionIdRef.current = null;
          const dbConversationId = conversationId ?? event.sessionId;
          await syncTranscriptFromSession(event.sessionId, dbConversationId);
        } else {
          setContent(event.content);
        }
      },
    );

    const errorSub = LocalLLMModule.addListener(
      "onStreamingError",
      async (event: StreamingErrorEvent) => {
        if (event.sessionId !== streamingSessionIdRef.current) return;

        setError(event.error);
        setLoading(false);
        streamingSessionIdRef.current = null;
        const dbConversationId = conversationId ?? event.sessionId;
        await syncTranscriptFromSession(event.sessionId, dbConversationId);
      },
    );

    subscriptionsRef.current = [chunkSub, errorSub];

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, [conversationId, syncTranscriptFromSession]);

  const startStreaming = async (prompt: string) => {
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
      const conversationTitleFromPrompt = getFirstWords(trimmedPrompt);
      setLoading(true);
      setError(null);
      setContent("");

      const activeSession = session ?? (await startSession(null, conversationTitleFromPrompt));
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
        const dbConversationId = conversationId ?? activeSession.id;
        await syncTranscriptFromSession(activeSession.id, dbConversationId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start streaming");
      setLoading(false);
      streamingSessionIdRef.current = null;
    }
  };

  const hydrateSession = async (hydrationTranscript: ModelTranscript, existingId?: string) => {
    setContent("");
    setLoading(false);
    streamingSessionIdRef.current = null;

    if (existingId) setConversationId(existingId);

    return await startSession(hydrationTranscript);
  };

  const reset = () => {
    setContent("");
    setError(null);
    setSession(null);
    setTranscript({ entries: [] });
    setLoading(false);
    streamingSessionIdRef.current = null;
    setConversationId(null);
  };

  const hasTranscript = transcript.entries.some((entry) => entry.role !== "instructions");

  return {
    content,
    session,
    sessionId: session?.id ?? null,
    conversationId,
    transcript,
    hasTranscript,
    loading,
    error,
    startSession,
    hydrateSession,
    startStreaming,
    reset,
  };
};
