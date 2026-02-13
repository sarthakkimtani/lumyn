import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatListItem } from "@/components/features/chat/chat-list-item";
import { ScrollDownButton } from "@/components/features/chat/scroll-down-button";
import { StreamingItem } from "@/components/features/chat/streaming-item";
import { ChatRow, useChatList } from "@/hooks/use-chat-list";

import { TranscriptEntry } from "@/modules/local-llm";

type ChatListProps = {
  entries: TranscriptEntry[];
  loading: boolean;
  streamingContent: string;
};

export const ChatList = ({ entries, loading, streamingContent }: ChatListProps) => {
  const {
    listRef,
    rows,
    showScrollDownButton,
    scrollToEnd,
    onLayout,
    onContentSizeChange,
    onScroll,
  } = useChatList({ entries, loading });

  return (
    <View style={{ flex: 1 }}>
      <FlashList<ChatRow>
        ref={listRef}
        data={rows}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyExtractor={(item) => item.id}
        onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
        onContentSizeChange={onContentSizeChange}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => onScroll(nativeEvent)}
        renderItem={({ item, index }) =>
          item.type === "entry" ? (
            <ChatListItem entry={item.entry} isLast={index === rows.length - 1} />
          ) : (
            <StreamingItem content={streamingContent} />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <ScrollDownButton visible={showScrollDownButton} onPress={scrollToEnd} />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  separator: {
    height: 10,
  },
});
