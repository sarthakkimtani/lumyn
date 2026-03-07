import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";

export const ReasoningCard = ({
  content,
  expanded,
  onToggle,
}: {
  content: string;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const progress = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: 180,
    });
  }, [expanded, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      maxHeight: interpolate(progress.value, [0, 1], [0, 500], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        onPress={onToggle}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ThemedSymbolView weight="medium" size={16} themeColor="textSecondary" name="brain" />
          <Text style={styles.title}>Thinking</Text>
        </View>
        <ThemedSymbolView
          weight="medium"
          size={12}
          themeColor="textSecondary"
          name={expanded ? "chevron.down" : "chevron.right"}
        />
      </Pressable>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.body} selectable>
          {content}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerPressed: {
    opacity: 0.8,
  },
  title: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  content: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingHorizontal: 12,
  },
  body: {
    paddingVertical: 10,
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
}));
