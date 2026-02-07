import { Stack } from "expo-router";

import { Chat } from "@/components/screens/chat";

export default function ChatScreen() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon={"bubble.left.and.text.bubble.right"} onPress={() => {}} />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="shield" onPress={() => {}} />
      </Stack.Toolbar>

      <Chat />
    </>
  );
}
