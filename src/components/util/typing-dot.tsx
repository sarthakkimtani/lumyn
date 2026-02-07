import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

export const TypingDot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 380 }), withTiming(0.25, { duration: 380 })),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
};

const styles = StyleSheet.create((theme) => ({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.textSecondary,
  },
}));
