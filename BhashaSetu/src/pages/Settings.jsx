import { PageHeader } from '../components/Header';
import { useApp } from '../context/AppContext';
import { useVoice } from '../context/VoiceContext';
import { CLASSES } from '../data/content';
import { engine } from '../services/engine';

function Toggle({ checked, onChange, label }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} className={`switch ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}>
      <i />
    </button>
  );
}

export default function Settings() {
  const { klass, setKlass, direction, setDirection, prefs, setPrefs } = useApp();
  const voice = useVoice();
  return (
    <div className="page settings">
      <PageHeader title="Settings" subtitle="Make Johar comfortable for your classroom" />
      <div className="surface settings__card">
        <div className="row">
          <div><b>Class</b><small>The class you are teaching today</small></div>
          <select value={klass} onChange={(e) => setKlass(e.target.value)} aria-label="Class">
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="row">
          <div><b>Translation direction</b><small>Who speaks, and who listens</small></div>
          <div className="seg-text" role="group" aria-label="Translation direction">
            <button className={direction === 'hi-sat' ? 'is-on' : ''} onClick={() => { voice.reset(); setDirection('hi-sat'); }}>Hindi → Mundari</button>
            <button className={direction === 'sat-hi' ? 'is-on' : ''} onClick={() => { voice.reset(); setDirection('sat-hi'); }}>Mundari → Hindi</button>
          </div>
        </div>
        <div className="row">
          <div><b>Slow speech</b><small>How slowly the "Slow" button plays</small></div>
          <input type="range" min="0.4" max="0.9" step="0.05" value={prefs.voiceSpeed} onChange={(e) => setPrefs({ voiceSpeed: +e.target.value })} aria-label="Slow speech speed" />
        </div>
        <div className="row">
          <div><b>Larger text</b><small>Easier to read from across the room</small></div>
          <Toggle checked={prefs.largeText} onChange={(v) => setPrefs({ largeText: v })} label="Larger text" />
        </div>
        <div className="row">
          <div><b>Calmer animations</b><small>Turns off most movement, including the character's gestures</small></div>
          <Toggle checked={prefs.reduceMotion} onChange={(v) => setPrefs({ reduceMotion: v })} label="Calmer animations" />
        </div>
        <div className="row">
          <div><b>About</b><small>Johar • Every Child. Every Language. • Engine: {engine.mode} mode</small></div>
        </div>
      </div>
    </div>
  );
}
