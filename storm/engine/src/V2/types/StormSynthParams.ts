import { RainParams } from "./RainParams";
import { ThunderParams } from "./ThunderParams"; // You’ll create this later

export type Range<T = number> = {
    min: T;
    max: T;
};

export interface StormSynthParams {
    masterVolume: number;
    eqGains: number[];
    rainParams: RainParams & { on: boolean };
    thunderParams: ThunderParams & { on: boolean };
}
