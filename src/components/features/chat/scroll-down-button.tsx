import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const ScrollDownButton = ({
  visible,
  onPress,
}: {
  visible: boolean;
  onPress: () => void;
}) => {
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 250 });
  }, [progress, visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: 0.85 + progress.value * 0.15 }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.scrollDownButton}>
        <Pressable onPress={onPress}>
          <ThemedSymbolView themeColor="primary" name="arrow.down" size={20} weight="bold" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  scrollDownButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    position: "absolute",
    alignSelf: "center",
    bottom: 25,
    padding: 8,
  },
}));
