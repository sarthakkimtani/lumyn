import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useUnistyles } from "react-native-unistyles";

import { Unavailable } from "@/components/screens/unavailable";

import { systemPrompt } from "@/constants/prompt";
import LocalLLMModule, { ModelAvailability } from "@/modules/local-llm";

export const AppLayout = () => {
  const { theme } = useUnistyles();
  const [availability, setAvailability] = useState<ModelAvailability | null>(null);

  // TODO: Figure out if useEffect should be used here or not
  useEffect(() => {
    const response = LocalLLMModule.checkAvailability();
    setAvailability(response.available);

    if (response.available === "available") {
      LocalLLMModule.setSystemPrompt(systemPrompt);
    }
    SplashScreen.hideAsync();
  }, []);

  if (availability == null) return null;
  if (availability !== "available") return <Unavailable reason={availability} />;

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
    </Stack>
  );
};
