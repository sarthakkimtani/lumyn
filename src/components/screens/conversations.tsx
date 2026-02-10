import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ConversationsList } from "@/components/features/conversations/conversations-list";
import { ThemedSymbolView } from "@/components/util/themed-symbol-view";
import { conversations } from "@/db/schema";
import { useQueries } from "@/hooks/use-queries";

type ConversationRow = typeof conversations.$inferSelect;

export const Conversations = () => {
  const { fetchConversations } = useQueries();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        const conversationsFromDb = await fetchConversations();
        setRows(conversationsFromDb);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();
  }, [fetchConversations]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rows.length === 0 ? (
        <View style={styles.stateContainer}>
          <ThemedSymbolView
            name="bubble.left.and.text.bubble.right"
            themeColor="textSecondary"
            size={64}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtitle}>Start a chat to see it here.</Text>
        </View>
      ) : (
        <ConversationsList data={rows} />
      )}
    </View>
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
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 6,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  emptySubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    textAlign: "center",
  },
}));
