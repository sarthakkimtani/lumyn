import { useEffect } from "react";
import Animated, {
  LinearTransition,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ConversationTile } from "@/components/features/conversations/conversation-tile";
import { DeleteButton } from "@/components/features/conversations/delete-button";

import { conversations } from "@/db/schema";
import { StyleSheet } from "react-native-unistyles";

type ConversationRow = typeof conversations.$inferSelect;

const EDIT_ANIMATION_DURATION = 150;
const DELETE_BUTTON_WIDTH = 42;

export const AnimatedRow = ({
  item,
  editing,
  isFirst,
  isLast,
  onDelete,
  onPress,
}: {
  item: ConversationRow;
  editing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onDelete?: (id: string) => Promise<void>;
  onPress: () => void;
}) => {
  const progress = useSharedValue(editing ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(editing ? 1 : 0, {
      duration: EDIT_ANIMATION_DURATION,
    });
  }, [editing, progress]);

  const deleteContainerStyle = useAnimatedStyle(() => ({
    width: progress.value * DELETE_BUTTON_WIDTH,
    opacity: progress.value,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  }));

  return (
    <Animated.View
      style={styles.row}
      layout={LinearTransition.duration(EDIT_ANIMATION_DURATION)}
      exiting={SlideOutRight.duration(EDIT_ANIMATION_DURATION)}
    >
      <Animated.View style={deleteContainerStyle}>
        <DeleteButton onPress={() => onDelete?.(item.id)} />
      </Animated.View>
      <ConversationTile conversation={item} isFirst={isFirst} isLast={isLast} onPress={onPress} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
