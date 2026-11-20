import { StormPlayerHeader } from "./synth/header/storm-player-header";
import { StormTabs } from "./synth/storm-controls/storm-tabs";
import { StormSynthControllerProvider } from "../hooks/storm-synth-controller-provider";

export function StormSynthSynth() {
  return (
    <StormSynthControllerProvider>
      <div className="storm-player">
        <StormPlayerHeader />
        <div className="storm-controls">
          <StormTabs />
        </div>
      </div>
    </StormSynthControllerProvider>
  );
}
