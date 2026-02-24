import { Text, View } from "react-native";
import Animated, { FadeInDown, SharedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ProgressBar } from "@/components/features/download/progress-bar";
import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const DownloadProgress = ({
  percentage,
  progressWidth,
}: {
  percentage: number;
  progressWidth: SharedValue<number>;
}) => {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
      <View style={styles.iconCircle}>
        <ThemedSymbolView size={30} name="arrow.down.circle" themeColor="primary" />
      </View>

      <Text style={styles.title}>Downloading</Text>

      <Text style={styles.description}>Setting up your on-device AI.</Text>

      <ProgressBar percentage={percentage} progressWidth={progressWidth} />
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  section: {
    width: "100%",
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
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
}));
