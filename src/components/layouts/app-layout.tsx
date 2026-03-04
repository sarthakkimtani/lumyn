import { isModelDownloaded } from "@react-native-ai/llama";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { useModelContext } from "@/contexts/model-context";
import { MODEL_ID, prepareAgent } from "@/lib/agent";

export const AppLayout = () => {
  const { theme, rt } = useUnistyles();
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
    <>
      <StatusBar animated style={rt.themeName === "light" ? "dark" : "light"} />
      <Stack
        screenOptions={() => ({
          headerShadowVisible: false,
          headerTransparent: Platform.OS === "ios",
          headerTintColor: theme.colors.text,
          headerStyle: {
            backgroundColor: Platform.OS === "android" ? theme.colors.background : "transparent",
            elevation: 0,
          },
          headerTitleStyle: { color: theme.colors.text },
        })}
      >
        <Stack.Protected guard={!ready}>
          <Stack.Screen name="(download)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={ready}>
          <Stack.Screen name="index" />
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
    </>
  );
};
