import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useUnistyles } from "react-native-unistyles";

export default function RootLayout() {
  const { theme } = useUnistyles();

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
