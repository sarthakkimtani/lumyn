import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ResponseFooter } from "@/components/features/chat/response-footer";
import { MarkdownRenderer } from "@/components/features/markdown/markdown-renderer";
import { ThemedGlassView } from "@/components/util/themed-glass-view";

import { TranscriptEntry } from "@/modules/local-llm";

export const ChatListItem = ({ entry, isLast }: { entry: TranscriptEntry; isLast?: boolean }) => {
  if (entry.role === "instructions") return null;
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
    <View style={styles.assistantContainer}>
      <MarkdownRenderer markdown={entry.text} />
      {isLast && <ResponseFooter entry={entry} />}
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
  assistantContainer: {
    gap: 20,
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
