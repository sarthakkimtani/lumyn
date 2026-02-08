import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { MarkdownRenderer } from "@/components/features/markdown/markdown-renderer";
import { ThemedGlassView } from "@/components/util/themed-glass-view";

import { TranscriptEntry } from "@/modules/local-llm";

export const ChatListItem = ({ entry }: { entry: TranscriptEntry }) => {
  if (entry.role === "prompt") {
    return (
      <View style={styles.userRow}>
        <ThemedGlassView style={styles.userBubble} themeColor="primary">
          <Text style={styles.userText}>{entry.text}</Text>
        </ThemedGlassView>
      </View>
    );
  }

  return (
    <View style={styles.assistantRow}>
      <MarkdownRenderer markdown={entry.text} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  userRow: {
    width: "100%",
    alignItems: "flex-end",
  },
  userBubble: {
    maxWidth: "82%",
    borderRadius: 22,
    borderBottomRightRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  userText: {
    color: "#FFF",
    fontSize: 16,
    lineHeight: 21,
  },
  assistantRow: {
    width: "100%",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 15,
  },
  assistantText: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
}));
