import { router, Stack } from "expo-router";

type ChatToolbarProps = {
  hasTranscript: boolean;
  onNewChat: () => void;
  rightActions?: React.ReactNode;
};

export const ChatToolbar = ({ hasTranscript, onNewChat, rightActions }: ChatToolbarProps) => {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="bubble.left.and.text.bubble.right"
          onPress={() => router.push("/conversations")}
        />
        <Stack.Toolbar.Button icon="gear" onPress={() => {}} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          hidden={!hasTranscript}
          icon="square.and.pencil"
          onPress={onNewChat}
        />
        {rightActions}
      </Stack.Toolbar>
    </>
  );
};
