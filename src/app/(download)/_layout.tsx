import { Stack } from "expo-router";

export default function DownloadLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="download" />
    </Stack>
  );
}
