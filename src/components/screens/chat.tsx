import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatRoot } from "@/components/features/chat/chat-root";

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

export const Chat = () => {
  const { temporary, id } = useLocalSearchParams<{ temporary?: string; id?: string }>();
  const { fetchConversationById, fetchTranscriptByConversationId } = useQueries();

  const conversationId = typeof id === "string" && id.length > 0 ? id : null;
  const isTemporary = temporary === "true" && !conversationId;

  const [chatInstanceKey, setChatInstanceKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTranscript, setInitialTranscript] = useState<ModelTranscript | null>(null);

  const hasTranscript = Boolean(initialTranscript?.entries.some((e) => e.role !== "instructions"));

  useEffect(() => {
    let cancelled = false;
    if (!conversationId) {
      setLoading(false);
      setError(null);
      setInitialTranscript(null);
      return;
    }

    const hydrate = async () => {
      setLoading(true);
      setError(null);

      try {
        const [conversation, entries] = await Promise.all([
          fetchConversationById(conversationId),
          fetchTranscriptByConversationId(conversationId),
        ]);
        if (cancelled) return;

        if (!conversation) {
          setInitialTranscript(null);
          setError("Conversation not found");
          return;
        }

        setInitialTranscript(buildTranscript(entries));
      } catch (e) {
        if (cancelled) return;
        setInitialTranscript(null);
        setError(e instanceof Error ? e.message : "Failed to load conversation");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [conversationId, fetchConversationById, fetchTranscriptByConversationId]);

  const startNewChat = () => {
    router.setParams({ temporary: "false", id: "" });
    setChatInstanceKey((prev) => prev + 1);
    setInitialTranscript(null);
  };

  const toggleTemp = () => {
    router.setParams({ temporary: (!isTemporary).toString() });
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="bubble.left.and.text.bubble.right"
          onPress={() => router.push("/conversations")}
        />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={!hasTranscript}
          icon="square.and.pencil"
          onPress={startNewChat}
        />
        <Stack.Toolbar.Button
          hidden={hasTranscript}
          icon={isTemporary ? "shield.fill" : "shield"}
          onPress={toggleTemp}
        />
      </Stack.Toolbar>

      {loading ? (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ChatRoot
          key={conversationId ?? `new-${chatInstanceKey}`}
          temporary={isTemporary}
          conversationId={conversationId}
          initialTranscript={initialTranscript}
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
    textAlign: "center",
    fontSize: 14,
  },
}));
