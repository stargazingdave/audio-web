# Audio UI Kit

React controls for audio interfaces: `Knob`, `Equalizer`, `AmpToggleSwitch`, and `Visualization`.
The package includes ESM, CommonJS, TypeScript declarations and automatic scoped styles.
It has no dependency on Storm Synth, Tailwind, or a theme provider. The
visualization reads a caller-provided Web Audio `AnalyserNode`; it does not
create an audio context or start playback.

## Install and use

Release candidate: **1.0.0-beta.1**, intended for the `beta` tag. After the
first publication, install it with `npm install audio-ui-kit@beta`. This is a 1.0
API candidate; interfaces may still change between beta versions. See the
[release procedure](https://github.com/stargazingdave/audio-web#publish-a-library-release)
for verification and publishing commands. Normal releases are independent of
the Storm engine's version.

From another project, install the locally packed library:

```sh
npm install /path/to/storm-synth-ui-1.0.0-beta.1.tgz
```

React is a peer dependency; the package accepts React 18 or 19. The monorepo
currently tests with React 19. No CSS import is needed for the default entry point.
Importing it in the browser installs one `<style data-audio-ui-kit>` element in
`document.head`. Server-side imports never access the DOM.

```tsx
import { useState } from 'react';
import { Knob, Equalizer, AmpToggleSwitch } from 'audio-ui-kit';

export function AudioControls() {
  const [volume, setVolume] = useState(0.5);
  const [gains, setGains] = useState([0, 0, 0]);
  const [enabled, setEnabled] = useState(true);

  return <>
    <Knob label="Volume" min={0} max={1} step={0.01}
      value={volume} onChange={setVolume} disabled={!enabled} />
    <Equalizer freqs={[100, 1000, 10000]} gains={gains}
      onChange={(index, value) => setGains(current =>
        current.map((gain, i) => i === index ? value : gain))} />
    <AmpToggleSwitch label="Enabled" checked={enabled} onChange={setEnabled} />
  </>;
}
```

All controls are controlled components: the caller owns the current values and
handles changes. Audio-engine bindings and application themes belong in the app.
The Storm demo provides an example of these bindings.

## Components

- **Knob**: required `value` and `onChange`; optional `min` (0), `max` (100),
  `step` (1), `label`, `disabled`, `size` (100 pixels), `strokeWidth`, `trackWidth`,
  `colors`, `density` and `className`. Supports pointer dragging, arrow/Page keys and an
  editable numeric value. Colors: `labels`, `body`, `face`, `indicator`, `track`.
  Use six-digit hex values for the body color, which generates a shaded gradient.
- **Equalizer**: required `gains`, `freqs` and `onChange(index, value)`. Supply
  matching frequency/gain arrays. Optional `min` (-12), `max` (12), `height` (200
  pixels), `rotateLabels`, `className` and `colors` (`bar`, `background`, `Hz`, `dB`).
  Also accepts `density`. Supports full-column pointer dragging, arrow/Page keys,
  Home/End, Shift for fine adjustment, and double-click to reset a band to 0 dB.
  Frequency labels align with the faders; guides include the zero-dB position.
  The dB scale adapts to available width, and hover/focus shows the exact gain.
  **Flat** resets all bands to 0 dB and is disabled when already flat. Optional
  `onReset(gains)` receives the complete reset array for an atomic state update;
  otherwise `onChange(index, value)` is called for each band. Use functional
  state updates in that callback. For ranges excluding zero, reset uses the
  nearest allowed gain.
  Optional `barsBackground` accepts decorative React content (for example,
  `<Visualization height="100%" ... />`) behind only the bars area. It is clipped
  to that area, excluded from accessibility, and does not intercept pointer
  input. Guides and interactive bars render above it; the dB scale, frequency
  labels, and Flat button remain outside it. Set its opacity through
  `.audio-equalizer__background` in your app if desired.
- **AmpToggleSwitch**: required `checked` and `onChange`; optional `label`,
  `disabled` and `className`. A keyboard-accessible switch with an amp-style lever.
- **Visualization**: required `analyser` (`AnalyserNode | null`) and `isPlaying`.
  Optional `type` (`"waveform"` or `"spectrum"`), `barCount` (32), `color`,
  `height` (120px, or a CSS length), `className`, accessible `label`, and
  `visualStyle` (`"phosphor"`, `"aurora"`, `"valve"`, or `"matrix"`).
  These render glowing oscilloscope traces, colored ribbons over a nebula with
  a reflective glass overlay, warm amber tube filaments, or an LED matrix. All four support both
  waveform and spectrum modes. Spectrum range is configurable with
  `minFrequency` (20 Hz) and `maxFrequency` (20000 Hz), capped at the analyser's
  Nyquist frequency. It maps bars logarithmically within this range, averaging FFT
  power within each band.
  Invalid ranges fall back to the defaults; ranges entirely above Nyquist show
  no activity. These props apply to spectrum mode in all four styles.
  Heights use the analyser's decibel bounds; low-frequency detail is limited
  by its FFT size. It resizes to its container, respects pixel
  density, renders a static idle view while paused, and cancels its animation
  on unmount. Reduced-motion preferences remove decorative drift and trails
  while retaining the live audio readout. Supply `height="100%"` inside a
  container with an explicit height, as the Storm demo does.

```tsx
import { Visualization } from 'audio-ui-kit';

<Visualization analyser={analyser} isPlaying={isPlaying} type="spectrum"
  visualStyle="aurora" maxFrequency={12000} height={80} color="#9cd8e4" />
<Equalizer gains={gains} freqs={frequencies} onChange={setBand}
  onReset={setGains}
  barsBackground={<Visualization analyser={analyser} isPlaying={isPlaying}
    type="spectrum" visualStyle="aurora" height="100%" />} />
```

Prop/color interfaces are exported alongside the components. Use a positive
`step` and `max > min` for numeric controls.

### Compact controls

`Knob` and `Equalizer` accept `density="compact"`. The default remains
`"comfortable"` for existing consumers. Compact knobs use a 64px dial and omit
the min/max captions while retaining an editable value and accessible bounds.
Compact EQs are 128px tall with a three-tick scale and shorter frequency labels.
Explicit `size` (knob) or `height` (EQ) overrides the density's default dimensions.

```tsx
<Knob density="compact" label="Volume" value={volume} onChange={setVolume} />
<Equalizer density="compact" gains={gains} freqs={frequencies} onChange={setBand} />
```

The library owns layout and interaction; consumers still choose their own
colors, panel widths, and surrounding spacing. `ControlDensity` is exported
for wrappers that forward a density option.

## Styling

Default imports include the component CSS and install it automatically in the
browser. The stylesheet is inserted before existing head content so host styles
can override it, including when the library is loaded lazily. ESM/CommonJS
copies and multiple component instances share one style element per document.
Production bundlers retain this initialization through the package's
`sideEffects` metadata. It does not add a global page reset.

Classes are prefixed `audio-`. Controls inherit text color and can be customized
with their color props or an app-owned `className`. The focus outline color can
be changed with the inherited `--audio-focus-color` CSS custom property.
Motion respects `prefers-reduced-motion`.

No CSS tooling or theme provider is required. For example:

```css
.my-audio-controls { --audio-focus-color: #44cdda; }
.my-audio-controls .audio-equalizer__background { opacity: 0.6; }
```

### SSR and explicit stylesheet control

Both entry points can be imported and server-rendered without `window` or
`document`. Default imports only inject styles when evaluated in a browser;
they do not emit CSS in server HTML. To style the first server-rendered frame,
let your framework include the CSS in the document before hydration:

```tsx
import { Knob, Equalizer, Visualization } from 'audio-ui-kit/unstyled';
import 'audio-ui-kit/styles.css'; // Your framework/bundler loads or extracts this.
```

`audio-ui-kit/unstyled` exports the same components and types without injecting
anything. Use it with the explicit stylesheet for strict CSPs that disallow
inline `<style>` elements, or when your application manages styles itself.
Controls still use inline style attributes for dynamic sizes, colors and values;
your CSP needs to permit those attributes.
Plain Node.js can import the components, but CSS imports need your framework's
asset pipeline. The standalone CSS is marked as a side effect for bundlers.
Existing explicit CSS imports alongside the default entry still work, but
include duplicate rules; use the unstyled entry to keep only the external CSS.

Rendering and interaction need a browser with SVG, Canvas 2D, ResizeObserver and
pointer events. Visualization needs Web Audio only when live audio is supplied;
it never creates an AudioContext or starts playback. In React server-component
frameworks, put interactive controls inside a client component. Clean up the
audio graph you own when its player unmounts.

## Develop

From the repository root:

```sh
npm run build --workspace=audio-ui-kit
npm run dev:ui
npm run test --workspace=audio-ui-kit
npm run pack:ui
```

The package is independently versioned. `prepack` rebuilds the JavaScript,
declarations, automatically injected CSS, and the explicit CSS export so the
tarball contains everything consumers need. The tsup configuration treats the
source stylesheet as text for the default JS entry and copies that same file
for explicit imports. Watch mode rebuilds when the CSS changes.

Run `npm run test:package` from the root to verify production bundling in a
separate consumer without a CSS import, ESM/CommonJS and both declaration
formats, automatic styles, host overrides, interactions and server rendering.

## Instrument and application components

The library also exports these controlled, audio-engine-independent components.
They use the same automatic styles and SSR-safe entries as the existing controls.

- `PitchMeter`: `cents: number | null`, optional `active`, `tolerance` (3),
  `range` (50), `label`, and `className`. Accessible SVG cents gauge. Out-of-range
  display is clamped; the supplied measurement is never changed or snapped.
- `NoteSelector`: `notes: {id, name, octave, detail?}[]`, `value: string | null`,
  `onChange(id | null)`, and optional `detected`, `label`, `className`.
  Tapping the selected target returns null, allowing automatic mode.
- `LevelMeter`: normalized `level` (0–1), optional `label` and `className`.
- `SegmentedControl`: generic string `value`, `options: {value, label}[]`,
  `onChange`, accessible `label`, optional `disabled` and `className`.
- `SelectField`: labeled native select; accepts select attributes, option children,
  and optional `hint`. Generates a unique label/control association.
- `Button`: native button props and optional `variant`:
  `primary`, `secondary`, or `ghost`. Defaults to `type="button"`.
- `StatusIndicator`: children plus optional `tone`:
  `neutral`, `active`, or `warning`.
- `AudioIcon`: decorative icon with `name`:
  `microphone`, `stop`, `play`, `check`, `arrow`, `settings`, or `headphones`.

Theme with inherited CSS variables: `--audio-ink`, `--audio-on-ink`,
`--audio-accent`, `--audio-accent-soft`, `--audio-surface`,
`--audio-border`, `--audio-control-bg`, and `--audio-focus-color`.
No global reset or app-specific layout is installed.

```tsx
import { PitchMeter, NoteSelector } from 'audio-ui-kit';
<PitchMeter cents={reading ? reading.cents : null} active={isVoiced} />
<NoteSelector notes={[{ id: '40', name: 'E', octave: 2, detail: '6' }]}
  value={target} onChange={setTarget} />
```


### Combined tuner display and brand link

`TunerDisplay` combines `PitchMeter` with a measured note/frequency readout,
cent deviation, and concise tuning status. Required props: `note` (`{name,
octave} | null`), `frequency` (`number | null`), and `cents` (`number | null`).
Optional: `active`, `listening`, `tolerance` (3 cents), and `className`.
It owns no detection, target selection, or smoothing. Invalid readings remain
unmeasured; green requires valid live evidence. Use `--audio-display-bg` to
match the readout background to its instrument surface.

`BrandLink` takes `href`, `label`, and `logoSrc`, with optional `logoWidth` (28)
and `className`. It renders only the supplied logo and label as an external
link with `noopener noreferrer`. Theme a monochrome logo through
`--audio-logo-filter` when needed.
