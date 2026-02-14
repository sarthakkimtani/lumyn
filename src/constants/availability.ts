import { SFSymbol } from "expo-symbols";

import { ModelAvailability } from "@/modules/local-llm";

type ReasonConfig = {
  icon: SFSymbol;
  title: string;
  description: string;
  detail: {
    icon: SFSymbol;
    label: string;
  };
  showSettingsButton?: boolean;
};

export const availabilityConfig: Record<ModelAvailability, ReasonConfig> = {
  available: {
    icon: "checkmark.circle.fill",
    title: "Model Available",
    description: "Local model access is available on this device.",
    detail: { icon: "checkmark.circle.fill", label: "Ready" },
  },
  appleIntelligenceNotEnabled: {
    icon: "apple.intelligence",
    title: "Enable Apple Intelligence",
    description: "Lumyn requires Apple Intelligence to run. Turn it on in Settings to get started.",
    detail: { icon: "gear", label: "Requires Apple Intelligence" },
    showSettingsButton: true,
  },
  deviceNotEligible: {
    icon: "iphone.slash",
    title: "Device Not Supported",
    description:
      "This device doesn't meet the hardware requirements for on-device AI. A newer iPhone is needed.",
    detail: { icon: "cpu", label: "Incompatible hardware" },
  },
  incorrectIOSVersion: {
    icon: "arrow.up.circle",
    title: "iOS Update Required",
    description: "Lumyn needs iOS 26 or later. Update your device in Settings to continue.",
    detail: { icon: "info.circle", label: "iOS 26+ required" },
  },
  modelNotReady: {
    icon: "clock",
    title: "Model Not Ready",
    description: "Apple Intelligence is enabled but the model is still not ready.",
    detail: { icon: "clock", label: "Model not ready" },
  },
  unavailable: {
    icon: "exclamationmark.circle",
    title: "Unavailable",
    description:
      "Lumyn can't access the on-device model right now. Try again later or check your device settings.",
    detail: { icon: "questionmark.circle", label: "Unknown issue" },
  },
};
