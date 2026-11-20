import { createContext, useContext, type ReactNode } from "react";
import { useCreateStormSynthController } from "./use-storm-synth-controller";

const StormSynthControllerContext = createContext<ReturnType<typeof useCreateStormSynthController> | null>(null);

export function StormSynthControllerProvider({ children }: { children: ReactNode }) {
  const controller = useCreateStormSynthController();
  return (
    <StormSynthControllerContext.Provider value={controller}>
      {children}
    </StormSynthControllerContext.Provider>
  );
}

export function useStormSynthController() {
  const controller = useContext(StormSynthControllerContext);
  if (!controller) {
    throw new Error("useStormSynthController must be used inside StormSynthControllerProvider");
  }
  return controller;
}
