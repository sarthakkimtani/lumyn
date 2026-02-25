import { useState } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ReasoningCard } from "@/components/features/chat/reasoning-card";
import { MarkdownRenderer } from "@/components/features/markdown/markdown-renderer";

import { AgentMessage } from "@/lib/agent";
import { extractReasoningFromMessage, extractTextFromMessage } from "@/utils/chat";

export const AssistantContent = ({ message }: { message: AgentMessage }) => {
  const [reasoningExpanded, setReasoningExpanded] = useState(true);
  const textContent = extractTextFromMessage(message);
  const reasoningContent = extractReasoningFromMessage(message);

  return (
    <View style={styles.container}>
      {reasoningContent.length > 0 ? (
        <ReasoningCard
          content={reasoningContent}
          expanded={reasoningExpanded}
          onToggle={() => setReasoningExpanded((value) => !value)}
        />
      ) : null}
      {textContent.length > 0 ? <MarkdownRenderer markdown={textContent} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
