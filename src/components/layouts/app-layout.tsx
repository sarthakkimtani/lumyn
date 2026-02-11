import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useUnistyles } from "react-native-unistyles";

import { systemPrompt } from "@/config/prompt";
import LocalLLMModule from "@/modules/local-llm/src/LocalLLMModule";

export const AppLayout = () => {
  const { theme } = useUnistyles();

  useEffect(() => {
    LocalLLMModule.setSystemPrompt(systemPrompt);
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={() => ({
        title: "Lumyn",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTitleStyle: { color: theme.colors.text },
      })}
    >
      <Stack.Screen
        name="conversations"
        options={{ title: "Conversations", headerBackButtonDisplayMode: "minimal" }}
      />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
};
