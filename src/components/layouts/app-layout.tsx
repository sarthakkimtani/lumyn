import { apple } from "@react-native-ai/apple";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useUnistyles } from "react-native-unistyles";

import { Unavailable } from "@/components/screens/unavailable";

export const AppLayout = () => {
  const { theme } = useUnistyles();
  const [availability, setAvailability] = useState<boolean | null>(null);

  // TODO: Figure out if useEffect should be used here or not
  useEffect(() => {
    setAvailability(apple.isAvailable());
    SplashScreen.hideAsync();
  }, []);

  if (availability == null) return null;
  if (!availability) return <Unavailable />;

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
        options={{
          title: "Conversations",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
};
