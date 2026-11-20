import { describe, expect, it } from "vitest";
import savedStormSynthParams from "../../../../storm-synth-params-default.json";
import closeStormParams from "../../../../storm-synth-params-close-storm.json";
import farStormParams from "../../../../storm-synth-params-far-storm.json";
import { cloneStormSynthParams, initialStormSynthParams, stormSynthPresets } from "./storm-synth-params";

describe("cloneStormSynthParams", () => {
    it("uses the saved demo parameters as its initial state", () => {
        expect(initialStormSynthParams).toEqual(savedStormSynthParams);
    });

    it("provides the saved default, close storm, and far storm presets", () => {
        expect(stormSynthPresets.map(({ id, label }) => ({ id, label }))).toEqual([
            { id: "default", label: "Default" },
            { id: "close-storm", label: "Close Storm" },
            { id: "far-storm", label: "Far Storm" },
        ]);
        expect(stormSynthPresets[1].params).toEqual(closeStormParams);
        expect(stormSynthPresets[2].params).toEqual(farStormParams);
    });

    it("creates an independent deep clone", () => {
        const original = structuredClone(initialStormSynthParams);
        const clone = cloneStormSynthParams(original);

        clone.eqGains[0] += 1;
        clone.rainParams.eqGains[0] += 1;

        expect(clone).not.toBe(original);
        expect(clone.rainParams).not.toBe(original.rainParams);
        expect(clone.eqGains[0]).not.toBe(original.eqGains[0]);
        expect(clone.rainParams.eqGains[0]).not.toBe(original.rainParams.eqGains[0]);
    });
});
