# Migrating to Storm Synth and Audio UI Kit

Install the new beta packages:

```sh
npm install storm-synth@beta audio-ui-kit@beta
```

The packages are independent. Applications using only the sound engine do not need React or Audio UI Kit.

| Previous name | Current name |
| --- | --- |
| `noised-storm` | `storm-synth` |
| `noised-ui` | `audio-ui-kit` |
| `NoiseDController` | `StormSynthController` |
| `NoiseDStorm` | `StormSynth` |
| `NoiseDParams` | `StormSynthParams` |
| `_defaultNoiseDParams` | `_defaultStormSynthParams` |
| `noised_dsp.wasm` package export | `storm_synth_dsp.wasm` package export |
| `.noised-*` classes and CSS variables | `.audio-*` classes and CSS variables |

Update imports, bundler asset URLs, and any custom style overrides together. The UI's `styles.css` and `unstyled` subpaths remain available under `audio-ui-kit`. Worklet and WASM assets are included in the engine package; consumers do not need Rust.

```ts
import { StormSynthController } from 'storm-synth';
import workletUrl from 'storm-synth/rain.worklet.js?url';
import wasmUrl from 'storm-synth/storm_synth_dsp.wasm?url';

const controller = await StormSynthController.createWasm(audioContext, {}, {
    workletUrl,
    wasmUrl,
});
controller.start();
// On teardown:
controller.destroy();
```

The original JavaScript-only experiment is preserved separately in [storm-synth-legacy](https://github.com/stargazingdave/storm-synth-legacy). Its old package is not a drop-in API replacement for the current Rust/WebAssembly engine.

The native products are NoteGrip and Moddable Rig, by David Portal. Their VST class IDs, parameter IDs, and state formats are retained. Historical release filenames, storage keys, tags, and frozen reference archives remain intact so existing downloads and regression checks continue to work.

Before installing a renamed VST3 bundle, close the DAW and move its previous branded bundle outside plugin scan folders. Installing both names together creates duplicate VST class IDs. Keep backups outside scan folders.

Tuner is now served from `https://stargazingdave.github.io/tuner/`. Existing PWA installations tied to the previous repository URL should be reinstalled from the new address.
