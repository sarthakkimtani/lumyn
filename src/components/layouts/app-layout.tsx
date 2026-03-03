import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { isModelDownloaded } from "@react-native-ai/llama";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { useModelContext } from "@/contexts/model-context";
import { MODEL_ID, prepareAgent } from "@/lib/agent";

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
        <Stack.Screen
          name="index"
          options={{
            title: "Lumyn",
            headerTitleAlign: "center",
            headerLeft: () => (
              <View style={{ flexDirection: "row", gap: 5 }}>
                <MaterialIcons.Button
                  onPress={() => router.push("/conversations")}
                  backgroundColor="transparent"
                  color={theme.colors.textSecondary}
                  name="chat"
                  size={28}
                />
                <MaterialIcons.Button
                  onPress={() => router.push("/settings")}
                  backgroundColor="transparent"
                  color={theme.colors.textSecondary}
                  name="settings"
                  size={28}
                />
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <MaterialIcons.Button
                  name="lock-open"
                  size={28}
                  backgroundColor="transparent"
                  color={theme.colors.textSecondary}
                />
              </View>
            ),
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
