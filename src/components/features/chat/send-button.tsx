import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ThemedGlassView } from "@/components/util/themed-glass-view";

import { useChatContext } from "@/contexts/chat-context";

export const SendButton = ({ onPress }: { onPress: () => void }) => {
  const { status } = useChatContext();
  const spin = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  useEffect(() => {
    if (status === "submitted") {
      spin.value = withRepeat(withTiming(1, { duration: 850 }), -1, false);
      return;
    }

    spin.value = withTiming(0, { duration: 180 });
  }, [status, spin]);

  return (
    <Pressable accessibilityRole="button" disabled={status !== "ready"} onPress={onPress}>
      <ThemedGlassView themeColor="primary" isInteractive style={styles.sendButton}>
        <Animated.View style={iconStyle}>
          <SymbolView
            name={
              status === "streaming"
                ? "stop.fill"
                : status === "submitted"
                  ? "ellipsis"
                  : "arrow.up"
            }
            size={22}
            weight="bold"
            tintColor="#FFF"
          />
        </Animated.View>
      </ThemedGlassView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
});
