import { Pressable, Text } from "react-native";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
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
  return (
    <Animated.View style={styles.container} layout={LinearTransition.duration(180)}>
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        onPress={onToggle}
      >
        <Text style={styles.title}>Thinking</Text>
        <ThemedSymbolView
          weight="medium"
          size={12}
          themeColor="textSecondary"
          icon={{
            ios: expanded ? "chevron.down" : "chevron.right",
            android: expanded ? "keyboard-arrow-down" : "chevron-right",
          }}
        />
      </Pressable>
      {expanded ? (
        <Animated.View
          style={styles.content}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(140)}
        >
          <Text style={styles.body} selectable>
            {content}
          </Text>
        </Animated.View>
      ) : null}
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
  chevron: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  body: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
}));
