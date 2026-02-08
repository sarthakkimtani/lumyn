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

export const SendButton = ({
  loading,
  disabled,
  onSend,
}: {
  loading: boolean;
  disabled: boolean;
  onSend: () => void;
}) => {
  const spin = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  useEffect(() => {
    if (loading) {
      spin.value = withRepeat(withTiming(1, { duration: 850 }), -1, false);
      return;
    }

    spin.value = withTiming(0, { duration: 180 });
  }, [loading, spin]);

  return (
    <ThemedGlassView
      themeColor="primary"
      isInteractive
      style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
    >
      <Pressable accessibilityRole="button" onPress={onSend} disabled={disabled}>
        <Animated.View style={iconStyle}>
          <SymbolView
            name={loading ? "ellipsis" : "arrow.up"}
            size={22}
            weight="bold"
            tintColor="#FFF"
          />
        </Animated.View>
      </Pressable>
    </ThemedGlassView>
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
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
