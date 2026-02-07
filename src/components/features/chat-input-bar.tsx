import { GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

import { ThemedGlassView } from "@/components/util/themed-glass-view";

const ThemedTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.textSecondary,
}));

type ChatInputBarProps = {
  value: string;
  loading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export const ChatInputBar = ({
  value,
  loading,
  onChangeText,
  onSend,
  disabled = false,
}: ChatInputBarProps) => {
  const insets = useSafeAreaInsets();
  const spin = useSharedValue(0);
  const canSend = value.trim().length > 0 && !loading && !disabled;

  useEffect(() => {
    if (loading) {
      spin.value = withRepeat(withTiming(1, { duration: 850 }), -1, false);
      return;
    }

    spin.value = withTiming(0, { duration: 180 });
  }, [loading, spin]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  return (
    <View style={[styles.inputContainer, { marginBottom: insets.bottom }]}>
      <GlassView style={styles.glassContainer} isInteractive>
        <ThemedTextInput
          style={styles.textInput}
          placeholder="Ask anything"
          multiline
          maxLength={2000}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
      </GlassView>
      <ThemedGlassView
        color="primary"
        isInteractive
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
      >
        <Pressable accessibilityRole="button" onPress={onSend} disabled={!canSend}>
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
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 10,
    marginHorizontal: 14,
    gap: 10,
  },
  glassContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 45,
  },
  textInput: {
    fontSize: 16,
    color: theme.colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
}));
