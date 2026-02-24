import { Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export const ProgressBar = ({
  progressWidth,
  percentage,
}: {
  progressWidth: SharedValue<number>;
  percentage: number;
}) => {
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, progressBarStyle]} />
      </View>
      <Text style={styles.text}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    width: "100%",
    marginTop: 28,
    gap: 10,
    alignItems: "center",
  },
  track: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
}));
