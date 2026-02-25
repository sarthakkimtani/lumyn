import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type ModelContextValue = {
  ready: boolean | null;
  setReady: Dispatch<SetStateAction<boolean | null>>;
};

export const ModelContext = createContext<ModelContextValue | null>(null);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState<boolean | null>(null);

  return <ModelContext.Provider value={{ ready, setReady }}>{children}</ModelContext.Provider>;
};

export const useModelContext = () => {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelContext must be used inside ModelContext.Provider");
  return ctx;
};
