import { Stack } from "expo-router";
import { Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StyleSheet } from "react-native-unistyles";

import { ChatInputBar } from "@/components/features/chat-input-bar";
import { EmptyChatArea } from "@/components/features/empty-chat-area";

export default function Index() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon={"bubble.left.and.text.bubble.right"} onPress={() => {}} />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="shield" onPress={() => {}} />
      </Stack.Toolbar>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <EmptyChatArea />
        <ChatInputBar />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));
