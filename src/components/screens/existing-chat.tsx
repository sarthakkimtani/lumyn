import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatRoot } from "@/components/features/chat/chat-root";
import { ChatToolbar } from "@/components/toolbars/chat-toolbar";
import { transcriptEntries } from "@/db/schema";
import { useQueries } from "@/hooks/use-queries";
import { ModelTranscript } from "@/modules/local-llm";

type TranscriptEntryRow = typeof transcriptEntries.$inferSelect;

const buildTranscript = (entries: TranscriptEntryRow[]): ModelTranscript => ({
  entries: entries.map((entry) => ({
    id: entry.id,
    role: entry.role,
    text: entry.text,
    tool: null,
  })),
});

export const ExistingChat = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queries = useQueries();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasTranscript, setHasTranscript] = useState(false);
  const [initialTranscript, setInitialTranscript] = useState<ModelTranscript | null>(null);

  const conversationId = typeof id === "string" ? id : "";

  useEffect(() => {
    if (!conversationId) {
      setError("Invalid conversation id");
      setLoading(false);
      return;
    }

    const hydrateConversation = async () => {
      setLoading(true);
      setError(null);

      try {
        const [loadedConversation, loadedEntries] = await Promise.all([
          queries.fetchConversationById(conversationId),
          queries.fetchTranscriptEntriesByConversationId(conversationId),
        ]);

        if (!loadedConversation) {
          setError("Conversation not found");
          return;
        }

        setHasTranscript(loadedEntries.some((entry) => entry.role !== "instructions"));
        setInitialTranscript(buildTranscript(loadedEntries));
      } catch (hydrateError) {
        setError(
          hydrateError instanceof Error ? hydrateError.message : "Failed to load conversation",
        );
      } finally {
        setLoading(false);
      }
    };

    void hydrateConversation();
  }, [conversationId, queries]);

  return (
    <>
      <ChatToolbar hasTranscript={hasTranscript} onNewChat={() => router.dismissTo("/")} />
      {loading ? (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" />
        </View>
      ) : error || !initialTranscript ? (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.errorText}>{error ?? "Conversation unavailable"}</Text>
        </View>
      ) : (
        <ChatRoot
          key={conversationId}
          conversationId={conversationId}
          initialTranscript={initialTranscript}
          onHasTranscriptChange={setHasTranscript}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: "center",
  },
}));
