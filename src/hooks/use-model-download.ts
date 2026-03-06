import { useState } from "react";

import { MODEL_ID, prepareAgent } from "@/lib/agent";
import { modelDownloader } from "@/lib/model-downloader";

export const useModelDownload = ({ onReady }: { onReady: () => void }) => {
  const [state, setState] = useState("idle");
  const [percentage, setPercentage] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const startDownload = async (onProgress: (pct: number) => void) => {
    try {
      setState("downloading");

      const path = await modelDownloader.start(MODEL_ID, (p) => {
        setPercentage(p);
        onProgress(p);
      });

      setState("complete");
      return path;
    } catch (e) {
      setState("error");
      setErrorMessage(e instanceof Error ? e.message : "Download Failed");
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
