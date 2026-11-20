import { describe, expect, it } from "vitest";
import { cloneStormSynthParams, initialStormSynthParams, stormSynthPresets } from "./storm-synth-params";
import { parsePresetFile, serializePreset } from "./preset-files";

describe("preset files", () => {
  it("round-trips a named preset with the complete parameters", () => {
    const params = cloneStormSynthParams(initialStormSynthParams);
    params.masterVolume = 0.37;
    params.rainParams.dropRate = 120;
    expect(parsePresetFile(serializePreset("Evening Rain", params), "saved.json"))
      .toEqual({ label: "Evening Rain", params });
  });

  it("loads all existing plain parameter files using their filenames as labels", () => {
    for (const preset of stormSynthPresets) {
      expect(parsePresetFile(JSON.stringify(preset.params), `${preset.label}.json`))
        .toEqual({ label: preset.label, params: preset.params });
    }
  });

  it("rejects malformed or incomplete files and unsupported versions", () => {
    for (const text of ["{", "null", "[]", "{}", JSON.stringify({ version: 2, params: initialStormSynthParams })]) {
      expect(() => parsePresetFile(text, "bad.json")).toThrow();
    }
  });

  it("rejects invalid gains, reversed delays and values that cannot be applied to audio", () => {
    const mutations = [
      (p: typeof initialStormSynthParams) => { p.eqGains.pop(); },
      (p: typeof initialStormSynthParams) => { p.eqGains[0] = 50; },
      (p: typeof initialStormSynthParams) => { p.masterVolume = -1; },
      (p: typeof initialStormSynthParams) => { p.rainParams.volume = 2; },
      (p: typeof initialStormSynthParams) => { p.thunderParams.reverbDuration.value = 1e6; },
      (p: typeof initialStormSynthParams) => { p.delayBetweenThunders.min = p.delayBetweenThunders.max + 1; },
    ];
    for (const mutate of mutations) {
      const params = cloneStormSynthParams(initialStormSynthParams);
      mutate(params);
      expect(() => parsePresetFile(JSON.stringify(params), "bad.json")).toThrow();
    }
  });
});
