import { StormSynthSynth } from './features/storm-synth/components/storm-synth-synth';
import { ThemeSelector } from './components/theme/theme-selector';
export function App() {
  const og = new URLSearchParams(window.location.search).get('og') === '1';
  return <div id={og ? 'og-preview' : undefined} className={`demo-shell${og ? ' og-preview' : ''}`}>
    <nav className="demo-navbar" aria-label="Main navigation">
      <div className="demo-brand"><img alt="" width={40} height={40} src={`${import.meta.env.BASE_URL}images/storm-synth-logo-icon.png`} />
        <h1 className="demo-title">Storm Synth</h1></div>
      <ThemeSelector />
    </nav>
    <main><StormSynthSynth /></main>
    <footer className="demo-footer"><span>Rain & thunder, synthesized in real time.</span><span>Storm Synth · Made by David Portal</span></footer>
  </div>;
}
