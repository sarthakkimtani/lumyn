import { downloadModel } from "@react-native-ai/llama";
import { useState } from "react";

import { MODEL_ID, prepareAgent } from "@/lib/agent";

export type DownloadState = "idle" | "downloading" | "complete" | "error";
interface UseModelDownloadOptions {
  onReady: () => void;
}

export const useModelDownload = ({ onReady }: UseModelDownloadOptions) => {
  const [state, setState] = useState<DownloadState>("idle");
  const [percentage, setPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [preparing, setPreparing] = useState(false);

  const startDownload = async (onProgress: (pct: number) => void) => {
    setState("downloading");
    setPercentage(0);
    setErrorMessage("");

    try {
      await downloadModel(MODEL_ID, (progress) => {
        const pct = Math.round(progress.percentage);
        setPercentage(pct);
        onProgress(pct);
      });

      setPercentage(100);
      setState("complete");
    } catch (e) {
      setState("error");
      setErrorMessage(e instanceof Error ? e.message : "Download failed");
    }
  };

  const prepareModel = async () => {
    setPreparing(true);
    setErrorMessage("");

    try {
      await prepareAgent();
      onReady();
    } catch (e) {
      setState("error");
      setErrorMessage(e instanceof Error ? e.message : "Model loading failed");
    } finally {
      setPreparing(false);
    }
  };

  return {
    state,
    percentage,
    errorMessage,
    preparing,
    startDownload,
    prepareModel,
  };
};
