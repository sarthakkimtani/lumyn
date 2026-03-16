import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ThemedSymbolView } from "@/components/util/themed-symbol-view";
import { conversations } from "@/db/schema";
import { formatRelativeDate } from "@/utils/date";

type ConversationRow = typeof conversations.$inferSelect;

type ConversationTileProps = {
  conversation: ConversationRow;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: (conversation: ConversationRow) => void;
};

export const ConversationTile = ({
  conversation,
  isFirst = false,
  isLast = false,
  onPress,
}: ConversationTileProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        isFirst && styles.tileFirst,
        isLast && styles.tileLast,
        pressed && styles.tilePressed,
      ]}
      onPress={() => onPress?.(conversation)}
    >
      <View style={styles.iconContainer}>
        <ThemedSymbolView name="text.bubble.fill" themeColor="primary" size={20} />
      </View>
      <View style={[styles.content, !isLast && styles.contentSeparator]}>
        <Text numberOfLines={1} style={styles.titleText}>
          {conversation.title?.trim() || "Untitled chat"}
        </Text>
        <View style={styles.trailing}>
          <Text style={styles.dateText}>{formatRelativeDate(conversation.updatedAt)}</Text>
          <ThemedSymbolView name="chevron.right" themeColor="textSecondary" size={12} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  tile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    minHeight: 52,
    backgroundColor: theme.colors.card,
    overflow: "hidden",
  },
  tileFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tileLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  tilePressed: {
    backgroundColor: theme.colors.cardPressed,
  },
  iconContainer: {
    width: 20,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    paddingVertical: 14,
  },
  contentSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.separator,
  },
  titleText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    marginRight: 8,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 20,
  },
}));
