# David Portal Audio Web

Storm Synth and Audio UI Kit are independent libraries managed by one npm workspace.
The Storm demo consumes both; it is private and is not published.

| Directory | Package / purpose | Documentation |
| --- | --- | --- |
| `storm/engine` | `storm-synth`: Rust/WASM rain and Web Audio thunder | [Engine API, assets and lifecycle](storm/engine/README.md) |
| `ui` | `audio-ui-kit`: React audio controls with automatic scoped styling | [Components, styling and SSR](ui/README.md) |
| `storm/demo` | Vite/React player using both libraries | [Layout, presets and export](storm/demo/README.md) |
| `scripts` | Browser and standalone-package checks | Verification below |
| `artifacts` | Ignored screenshots, downloaded audio and tarballs | Local output only |

The sibling `../plugins` directory is a separate Git repository for native
VST3 plugins. It has its own C++ build and UI; this workspace does not build it.

## Set up and develop

Source builds require Node 22.12+, npm 11.21+, Rust stable and the
`wasm32-unknown-unknown` target. Run workspace commands from this directory:

```sh
rustup target add wasm32-unknown-unknown
npx npm@11.21.0 ci
npm run dev
```

The player opens at http://127.0.0.1:5173/. `dev` builds the two libraries before
starting Vite. Use `npm run dev:ui` in a second terminal to watch UI source and CSS.
Engine changes require rebuilding the engine; demo source uses Vite hot reload.

| Command | Result |
| --- | --- |
| `npm run build` | Builds engine JS/WASM, UI entries/styles/types, then `storm/demo/dist` |
| `npm run typecheck` | Checks all three TypeScript workspaces |
| `npm test` | Engine Node/Rust tests, UI tests, demo tests |
| `npm run check` | Build, typecheck and unit tests |
| `npm run preview` | Serves the built demo at http://127.0.0.1:4173/ |
| `npm run test:ui` | Chrome checks against the built demo: playback, controls, themes, files and responsive layout |
| `npm run test:package` | Installs packed libraries in an independent consumer; checks exports, types, SSR, assets, automatic/explicit styles and interactions |
| `npm run bench` | Rain performance benchmark |

Browser checks need installed Chrome. Set `AUDIO_BROWSER_CHANNEL` to another
installed Playwright browser channel, or `AUDIO_PLAYWRIGHT_PATH` to a Playwright
module path. Screenshots, downloads and tarballs are saved under `artifacts/`.

## Consume or package a library

```sh
npm run pack:library
npm run pack:ui
```

Install `artifacts/storm-synth-1.0.0-beta.1.tgz` or `artifacts/audio-ui-kit-1.0.0-beta.1.tgz` in
another project. Package versions are independent. Consumers need neither this
checkout nor Rust; worklet/WASM assets are included in the engine package.
React 18 or 19 is a UI peer dependency. Storm itself has no React dependency.

```tsx
import { Knob, Equalizer, Visualization } from 'audio-ui-kit';
// Styles are installed automatically in the browser. No CSS import is needed.
```

For SSR first-paint CSS or explicit style control, use `audio-ui-kit/unstyled`
with `audio-ui-kit/styles.css`; see the [UI README](ui/README.md). Neither library
requires Tailwind or a theme provider. Storm audio needs browser Web Audio,
HTTPS or localhost, and initialization from a user interaction.

## Publish a library release

Both packages are prepared as **1.0.0-beta.1**, with public access and the `beta`
dist-tag. The root and demo remain private. Their local workspace dependency
versions and the lockfile must match the libraries before publishing.

Run `npm run check` and `npm run test:package` first. Commit the release changes
and record the source revision before publishing; package contents are immutable
once a name/version is published. For the first manual release, enable npm 2FA,
then run these commands from the workspace root:

```sh
npm login
npm whoami
npm publish --workspace=storm-synth --access public --tag beta --dry-run
npm publish --workspace=audio-ui-kit --access public --tag beta --dry-run
npm publish --workspace=storm-synth --access public --tag beta
npm publish --workspace=audio-ui-kit --access public --tag beta
npm view storm-synth@beta version
npm view audio-ui-kit@beta version
```

Review the dry-run file lists: each package includes its README, license,
manifest and built exports; Storm also includes the worklet and WASM. Complete
the interactive authentication prompts. These unscoped names are always public.
Use `npm install storm-synth@beta` or `npm install audio-ui-kit@beta` in consuming
projects; `beta` is intentionally separate from the default `latest` tag.

For subsequent candidates, increment to `1.0.0-beta.2`, etc., update the demo's
workspace dependency versions and regenerate the lockfile. Once the API is
ready for stable use, publish a new `1.0.0` version with `--tag latest` and update
`publishConfig.tag` from `beta` to `latest`. The library versions can diverge
after their first releases. Publishing is manual; the Pages workflow does not
publish npm packages.

After verifying both replacements, the old `audio` package can be deprecated
with a migration message, or unpublished if npm's policy allows removal. For
packages older than 72 hours, removal requires no registry dependents, fewer
than 300 downloads in the last week, and a single owner/maintainer. See npm's
[unpublish policy](https://docs.npmjs.com/policies/unpublish/). Unpublishing
permanently removes installable versions; do not run it as part of normal releases.

## GitHub Pages deployment

Live demo: https://stargazingdave.github.io/audio-web/.

The [Pages workflow](.github/workflows/deploy-pages.yml) deploys each push to
`main` and supports manual runs from Actions. It installs locked npm dependencies
and Rust's WASM target, builds both libraries before the demo, then uploads only
`storm/demo/dist` to the `github-pages` environment. Actions use pinned commits.

Set Settings > Pages > Source to **GitHub Actions**. No custom deployment token
or secrets are required. The deployment job uses GitHub's built-in token.
Its environment links to the deployed URL; check the Actions run for failures.

Vite receives `VITE_BASE_PATH` from Pages metadata. Development defaults to `/`.
To check a production project path locally in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/audio-web/'
npm run build
npm run test:ui
npm run preview
# Open http://127.0.0.1:4173/audio-web/
# After stopping preview:
Remove-Item Env:VITE_BASE_PATH
```

On POSIX shells, use `export VITE_BASE_PATH=/audio-web/` and unset it afterward.
Keep the same base path for build, browser check and preview. Logo, starfields,
JS, CSS, WASM and AudioWorklet URLs respect the configured path.


## Manual Open Graph preview

Install/link the local CLI once from `C:\Code\og-capture` (`npm ci`, `npm run build`, `npm run browser:install`, `npm link`). Its README documents configuration and troubleshooting. No CLI dependency is added to this app.

```powershell
npm run og:preview
npm run og:generate
```

Run these commands from the **audio-web workspace root**. `/?og=1` uses the actual demo, default preset, shared controller, WASM/worklet engine, and `audio-ui-kit` visualization. Playwright clicks Play Storm and waits for running audio, nonzero analyser samples, and rendered canvas frames. Only the capture layout changes. Audio and the exact waveform remain naturally variable.

Generation writes `storm/demo/public/storm.png` (1200 × 630). Review and explicitly add the PNG and source changes to Git. It ships as a public static asset in the existing deployment; generation never runs during dev, build, CI, or deployment. Preview opens a visible browser; close its window or press Ctrl+C to clean up. Existing servers are reused and left running. If Web Audio needs a visible browser, set `browser.headed` to `true` and `browser.channel` to `"chrome"` in `og.config.json` (installed Chrome is already configured for visible previews on this machine).
