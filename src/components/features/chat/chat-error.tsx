import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const ChatError = ({ error }: { error: Error }) => {
  return (
    <View style={styles.errorContainer}>
      <ThemedSymbolView
        name="bubble.left.and.exclamationmark.bubble.right.fill"
        themeColor="error"
      />
      <Text style={styles.errorText}>{error.message}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  errorContainer: {
    margin: 12,
    padding: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ff5a5a1f",
    borderWidth: 1,
    borderColor: "#ff5a5a59",
  },
  errorText: {
    flexShrink: 1,
    color: theme.colors.error,
  },
}));
