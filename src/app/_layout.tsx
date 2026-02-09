import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useUnistyles } from "react-native-unistyles";

import { systemPrompt } from "@/config/prompt";
import LocalLLMModule from "@/modules/local-llm";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  fade: true,
});

export default function RootLayout() {
  const { theme } = useUnistyles();

  useEffect(() => {
    LocalLLMModule.setSystemPrompt(systemPrompt);
    SplashScreen.hideAsync();
  }, []);

  return (
    <KeyboardProvider>
      <Stack
        screenOptions={() => ({
          title: "Lumyn",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTitleStyle: { color: theme.colors.text },
        })}
      />
    </KeyboardProvider>
  );
}
