import { ThemedSymbolView } from "@/components/util/themed-symbol-view";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export const DownloadError = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(200)}
      style={styles.section}
    >
      <View style={styles.iconCircleError}>
        <ThemedSymbolView size={30} name="exclamationmark.triangle" themeColor="error" />
      </View>
      <Text style={styles.title}>Download Failed</Text>
      <Text style={styles.description}>{message}</Text>
      <Pressable style={styles.secondaryButton} onPress={onRetry}>
        <Text style={styles.secondaryButtonText}>Try Again</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  section: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  iconCircleError: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  secondaryButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card,
    borderWidth: 0.33,
    borderColor: theme.colors.cardBorder,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
