import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const DownloadIdle = ({ onStart }: { onStart: () => void }) => {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
      <View style={styles.iconCircle}>
        <ThemedSymbolView
          size={30}
          weight="medium"
          icon={{ ios: "arrow.down.circle", android: "download" }}
          themeColor="primary"
        />
      </View>
      <Text style={styles.title}>Download Model</Text>
      <Text style={styles.description}>
        Lumyn needs to download a language model to get started.
      </Text>
      <Pressable style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Download</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  section: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 28,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.background,
  },
}));
