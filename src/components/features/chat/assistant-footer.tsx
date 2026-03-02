import * as Clipboard from "expo-clipboard";
import { GlassView } from "expo-glass-effect";
import { SFSymbol } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, Share } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { MaterialSymbol, ThemedSymbolView } from "@/components/util/themed-symbol-view";

import { useChatContext } from "@/contexts/chat-context";
import { useQueries } from "@/hooks/use-queries";
import { AgentMessage } from "@/lib/agent";
import { extractTextFromMessage } from "@/utils/chat";

const IconButton = ({
  icon,
  onPress,
}: {
  icon: { ios: SFSymbol; android: MaterialSymbol };
  onPress: () => void;
}) => {
  return (
    <Pressable style={({ pressed }) => [pressed && styles.buttonPressed]} onPress={onPress}>
      <ThemedSymbolView size={21} weight="medium" icon={icon} themeColor="textSecondary" />
    </Pressable>
  );
};

export const AssistantFooter = ({ message }: { message: AgentMessage }) => {
  const { regenerate } = useChatContext();
  const { deleteMessageById } = useQueries();
  const [copied, setCopied] = useState(false);
  const text = extractTextFromMessage(message);

  useEffect(() => {
    if (copied) {
      const timerId = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timerId);
    }
  }, [copied]);

  const handleClipboardCopy = () => {
    if (copied) return;
    setCopied(true);
    Clipboard.setStringAsync(text);
  };

  const regenerateMessage = async () => {
    await deleteMessageById(message.id);
    await regenerate({ messageId: message.id });
  };

  return (
    <GlassView style={styles.container}>
      <IconButton
        icon={{
          ios: copied ? "checkmark" : "document.on.document",
          android: copied ? "done" : "content-copy",
        }}
        onPress={handleClipboardCopy}
      />
      <IconButton
        icon={{ ios: "square.and.arrow.up", android: "share" }}
        onPress={() => Share.share({ message: text })}
      />
      <IconButton
        icon={{ ios: "arrow.counterclockwise", android: "replay" }}
        onPress={regenerateMessage}
      />
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderRadius: 20,
    padding: 10,
  },
  buttonPressed: {
    opacity: 0.4,
  },
});
