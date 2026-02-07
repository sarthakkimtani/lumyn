import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatListItem } from "@/components/features/chat-list-item";
import { TypingDot } from "@/components/util/typing-dot";

import { TranscriptEntry } from "@/modules/local-llm";

export const StreamingItem = ({ content }: { content: string }) => {
  const streamingEntry: TranscriptEntry = {
    role: "response",
    text: content,
    tool: null,
  };

  if (content.trim().length > 0) {
    return <ChatListItem entry={streamingEntry} />;
  }

  return (
    <View style={styles.placeholder}>
      <View style={styles.dots}>
        <TypingDot delay={0} />
        <TypingDot delay={120} />
        <TypingDot delay={240} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create((theme) => ({
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
