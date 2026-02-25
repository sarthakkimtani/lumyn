import { View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

import { DownloadComplete } from "@/components/features/download/download-complete";
import { DownloadError } from "@/components/features/download/download-error";
import { DownloadIdle } from "@/components/features/download/download-idle";
import { DownloadProgress } from "@/components/features/download/download-progress";

import { useModelContext } from "@/contexts/model-context";
import { useModelDownload } from "@/hooks/use-model-download";

export const Download = () => {
  const { setReady } = useModelContext();
  const progressWidth = useSharedValue(0);

  const { state, percentage, errorMessage, preparing, startDownload, prepareModel } =
    useModelDownload({ onReady: () => setReady(true) });

  const handleStart = () =>
    startDownload((pct) => {
      progressWidth.value = withTiming(pct, { duration: 300 });
    });

  return (
    <View style={styles.container}>
      {state === "idle" && <DownloadIdle onStart={handleStart} />}
      {state === "downloading" && (
        <DownloadProgress percentage={percentage} progressWidth={progressWidth} />
      )}
      {state === "complete" && <DownloadComplete preparing={preparing} onStart={prepareModel} />}
      {state === "error" && <DownloadError message={errorMessage} onRetry={handleStart} />}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
}));
