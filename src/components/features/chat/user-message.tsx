import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedGlassView } from "@/components/util/themed-glass-view";

import { AgentMessage } from "@/lib/agent";

export const UserMessage = ({ message }: { message: AgentMessage }) => {
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
};

export const styles = StyleSheet.create((theme) => ({
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
}));
