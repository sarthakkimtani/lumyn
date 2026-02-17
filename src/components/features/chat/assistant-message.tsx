import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { AssistantFooter } from "@/components/features/chat/assistant-footer";
import { MarkdownRenderer } from "@/components/features/markdown/markdown-renderer";
import { TypingDot } from "@/components/util/typing-dot";

import { useChatContext } from "@/contexts/chat-context";
import { AgentMessage } from "@/lib/agent";
import { extractTextFromMessage } from "@/utils/chat";

export const AssistantMessage = ({
  message,
  isLast,
}: {
  message: AgentMessage;
  isLast?: boolean;
}) => {
  const textContent = extractTextFromMessage(message);
  const { status } = useChatContext();

  if (textContent.length === 0 && status === "streaming") {
    return (
      <View style={styles.placeholder}>
        <View style={styles.dots}>
          <TypingDot delay={0} />
          <TypingDot delay={120} />
          <TypingDot delay={240} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantContainer}>
      <MarkdownRenderer markdown={textContent} />
      {isLast && (status === "ready" || status === "error") && (
        <AssistantFooter message={message} />
      )}
    </View>
  );
};

export const styles = StyleSheet.create((theme) => ({
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
  placeholder: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 2,
  },
}));
