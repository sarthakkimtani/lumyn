import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useEffect, useMemo, useRef, useState } from "react";
import { NativeScrollEvent, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatListItem } from "@/components/features/chat-list-item";
import { ScrollDownButton } from "@/components/features/scroll-down-button";
import { StreamingItem } from "@/components/features/streaming-item";

import { TranscriptEntry } from "@/modules/local-llm";

type ChatListProps = {
  entries: TranscriptEntry[];
  loading: boolean;
  streamingContent: string;
};

type ChatRow =
  | { type: "entry"; id: string; entry: TranscriptEntry }
  | { type: "streaming"; id: string };

export const ChatList = ({ entries, loading, streamingContent }: ChatListProps) => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const listRef = useRef<FlashListRef<ChatRow>>(null);

  const rows = useMemo<ChatRow[]>(() => {
    const mappedEntries: ChatRow[] = entries.map((entry, index) => ({
      type: "entry",
      id: entry.id ?? `${entry.role}-${index}`,
      entry,
    }));

    if (loading) {
      mappedEntries.push({ type: "streaming", id: "__streaming__" });
    }

    return mappedEntries;
  }, [entries, loading]);

  const scrollToEnd = () => listRef.current?.scrollToEnd({ animated: true });

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const lastEntry = entries[entries.length - 1];
  useEffect(() => {
    if (lastEntry?.role === "prompt") {
      scrollToEnd();
    }
  }, [lastEntry?.id, lastEntry?.role]);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        ref={listRef}
        data={rows}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyExtractor={(item) => item.id}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          setIsAtBottom(isCloseToBottom(nativeEvent));
        }}
        renderItem={({ item }) =>
          item.type === "entry" ? (
            <ChatListItem entry={item.entry} />
          ) : (
            <StreamingItem content={streamingContent} />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <ScrollDownButton
        visible={contentHeight > viewportHeight && !isAtBottom}
        onPress={scrollToEnd}
      />
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
