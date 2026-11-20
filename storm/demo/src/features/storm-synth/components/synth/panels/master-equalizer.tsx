import type { StormSynthParams } from 'storm-synth';
import type { ReactNode } from 'react';
import type { StormSynthActions } from "../../../hooks/use-storm-synth-controller";
import { EQ_FREQUENCIES } from "../components/control-layout";
import { Equalizer, type EqualizerColors } from "audio-ui-kit";

interface MasterEqualizerProps {
    actions: StormSynthActions;
    colors: EqualizerColors;
    params: StormSynthParams;
    barsBackground?: ReactNode;
}

export function MasterEqualizer({ actions, colors, params, barsBackground }: MasterEqualizerProps) {
    return (
        <Equalizer
            colors={colors}
            freqs={EQ_FREQUENCIES}
            gains={params.eqGains}
            density="compact"
            barsBackground={barsBackground}
            onChange={actions.setMasterEqGain}
            onReset={actions.setMasterEqGains}
        />
    );
}
