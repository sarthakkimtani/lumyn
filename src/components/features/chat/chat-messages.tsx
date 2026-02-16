import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { ChatMessage } from "@/components/features/chat/chat-message";
import { ScrollDownButton } from "@/components/features/chat/scroll-down-button";

import { useChatList } from "@/hooks/use-chat-list";
import { AgentMessage } from "@/lib/agent";

export const ChatMessages = ({ messages }: { messages: AgentMessage[] }) => {
  const { listRef, showScrollDownButton, scrollToEnd, onLayout, onContentSizeChange, onScroll } =
    useChatList({ messages });

  return (
    <View style={{ flex: 1 }}>
      <FlashList<AgentMessage>
        ref={listRef}
        data={messages}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyExtractor={(item) => item.id}
        onLayout={(e) => onLayout(e.nativeEvent.layout.height)}
        onContentSizeChange={onContentSizeChange}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => onScroll(nativeEvent)}
        renderItem={({ item, index }) => (
          <ChatMessage message={item} isLast={index === messages.length - 1} />
        )}
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
