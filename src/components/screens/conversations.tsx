import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ConversationsList } from "@/components/features/conversations/conversations-list";
import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

import { conversations } from "@/db/schema";
import { useQueries } from "@/hooks/use-queries";

type ConversationRow = typeof conversations.$inferSelect;

export const Conversations = () => {
  const { deleteConversationById, fetchConversations } = useQueries();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        const conversationsFromDb = await fetchConversations();
        if (cancelled) return;
        setRows(conversationsFromDb);
      } catch (fetchError) {
        if (cancelled) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load conversations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadConversations();

    return () => {
      cancelled = true;
    };
  }, [fetchConversations]);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleRowDeletion = async (id: string) => {
    try {
      await deleteConversationById(id);
      setRows(rows.filter((row) => row.id !== id));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not delete conversation";
      Alert.alert("Error", message);
    }
  };

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button onPress={toggleEditing}>
          <Stack.Toolbar.Label>{isEditing ? "Done" : "Edit"}</Stack.Toolbar.Label>
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : rows.length === 0 ? (
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
          <ConversationsList onDelete={handleRowDeletion} editing={isEditing} data={rows} />
        )}
      </View>
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
    flex: 1,
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
