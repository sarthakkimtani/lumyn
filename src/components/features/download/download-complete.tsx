import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const DownloadComplete = ({
  preparing,
  onStart,
}: {
  preparing: boolean;
  onStart: () => void;
}) => {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
      <View style={styles.iconCircleSuccess}>
        <ThemedSymbolView size={30} weight="medium" name="checkmark.circle" themeColor="primary" />
      </View>
      <Text style={styles.title}>Ready to Go</Text>

      <Text style={styles.description}>Your model has been downloaded and is ready to use.</Text>
      <Pressable style={styles.primaryButton} onPress={onStart}>
        {preparing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Start Chatting</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

export const styles = StyleSheet.create((theme) => ({
  section: {
    alignItems: "center",
    width: "100%",
  },
  iconCircleSuccess: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
