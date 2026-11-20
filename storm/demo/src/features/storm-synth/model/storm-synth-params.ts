import type { StormSynthParams } from 'storm-synth';
import savedStormSynthParams from "../../../../storm-synth-params-default.json";
import closeStormParams from "../../../../storm-synth-params-close-storm.json";
import farStormParams from "../../../../storm-synth-params-far-storm.json";

export type StormSynthPresetId = "default" | "close-storm" | "far-storm" | `imported-${string}`;

export interface StormSynthPreset {
    id: StormSynthPresetId;
    label: string;
    params: StormSynthParams;
}

export const stormSynthPresets = [
    { id: "default", label: "Default", params: savedStormSynthParams as StormSynthParams },
    { id: "close-storm", label: "Close Storm", params: closeStormParams as StormSynthParams },
    { id: "far-storm", label: "Far Storm", params: farStormParams as StormSynthParams },
] as const satisfies readonly StormSynthPreset[];

export const initialStormSynthParams = stormSynthPresets[0].params;

export function cloneStormSynthParams(params: StormSynthParams): StormSynthParams {
    return structuredClone(params);
}
