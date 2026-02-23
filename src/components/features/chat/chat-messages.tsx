import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatError } from "@/components/features/chat/chat-error";
import { ChatMessage } from "@/components/features/chat/chat-message";
import { ScrollDownButton } from "@/components/features/chat/scroll-down-button";

import { AgentMessage } from "@/lib/agent";

export const ChatMessages = ({ messages, error }: { messages: AgentMessage[]; error?: Error }) => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const listRef = useRef<FlashListRef<AgentMessage>>(null);

  const scrollToEnd = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
    setIsAtBottom(true);
  }, []);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const onScroll = (nativeEvent: NativeScrollEvent) => setIsAtBottom(isCloseToBottom(nativeEvent));
  const onContentSizeChange = (_: number, height: number) => setContentHeight(height);
  const onLayout = (height: number) => setViewportHeight(height);

  return (
    <View style={{ flex: 1 }}>
      <FlashList<AgentMessage>
        ref={listRef}
        data={messages}
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(item) => item.id}
        onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
        onContentSizeChange={onContentSizeChange}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => onScroll(nativeEvent)}
        renderItem={({ item, index }) => (
          <ChatMessage message={item} isLast={index === messages.length - 1} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={error ? <ChatError error={error} /> : null}
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
