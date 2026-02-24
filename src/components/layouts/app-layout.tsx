import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useUnistyles } from "react-native-unistyles";

import { useModelContext } from "@/contexts/model-context";
import { MODEL_ID, prepareAgent } from "@/lib/agent";
import { isModelDownloaded } from "@react-native-ai/llama";
import { useEffect } from "react";

export const AppLayout = () => {
  const { theme } = useUnistyles();
  const { ready, setReady } = useModelContext();

  useEffect(() => {
    const init = async () => {
      const downloaded = await isModelDownloaded(MODEL_ID);
      setReady(downloaded);
      if (downloaded) {
        await prepareAgent();
      }
      SplashScreen.hideAsync();
    };

    init();
  }, [setReady]);

  if (ready === null) return null;

  return (
    <Stack
      screenOptions={() => ({
        headerShadowVisible: false,
        headerTransparent: true,
        headerTitleStyle: { color: theme.colors.text },
      })}
    >
      <Stack.Protected guard={!ready}>
        <Stack.Screen name="(download)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={ready}>
        <Stack.Screen
          name="index"
          options={{
            title: "Lumyn",
          }}
        />
        <Stack.Screen
          name="conversations"
          options={{
            title: "Conversations",
            headerLargeTitleEnabled: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerLargeTitleEnabled: true,
            headerBackButtonDisplayMode: "minimal",
          }}
        />
      </Stack.Protected>
    </Stack>
  );
};
