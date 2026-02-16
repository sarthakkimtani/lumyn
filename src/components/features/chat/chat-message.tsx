import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { AssistantFooter } from "@/components/features/chat/assistant-footer";
import { MarkdownRenderer } from "@/components/features/markdown/markdown-renderer";
import { ThemedGlassView } from "@/components/util/themed-glass-view";

import { AgentMessage } from "@/lib/agent";

export const ChatMessage = ({ message, isLast }: { message: AgentMessage; isLast?: boolean }) => {
  const textContent = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");

  if (message.role === "system") return null;
  if (message.role === "user") {
    return (
      <View style={styles.userRow}>
        <ThemedGlassView style={styles.userBubble} themeColor="primary">
          {message.parts.map((part, idx) =>
            part.type === "text" ? (
              <Text key={idx} style={styles.userText}>
                {part.text}
              </Text>
            ) : null,
          )}
        </ThemedGlassView>
      </View>
    );
  }

  return (
    <View style={styles.assistantContainer}>
      <MarkdownRenderer markdown={textContent} />
      {isLast && <AssistantFooter message={message} />}
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
