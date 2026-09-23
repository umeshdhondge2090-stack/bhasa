import { LuMic } from 'react-icons/lu';
import { useVoice } from '../context/VoiceContext';
import { useApp } from '../context/AppContext';
import { LANGS } from '../data/content';
import AudioWave from './AudioWave';

const COPY = {
  idle: ['Tap to Speak', null],
  result: ['Tap to Speak', 'again'],
  listening: ['Listening…', 'Tap when done'],
  thinking: ['Understanding…', 'One moment'],
  speaking: ['Speaking…', 'Tap to stop'],
};

/** The central microphone. idle -> listening -> thinking -> speaking -> result */
export default function VoiceInteraction({ theme = 'light', size = 'lg' }) {
  const { phase, toggle } = useVoice();
  const { direction } = useApp();
  const lang = direction === 'hi-sat' ? LANGS.hi.label : LANGS.sat.label;
  const [title, sub] = COPY[phase];
  const subtitle = sub === null ? lang : sub === 'again' ? `${lang} • speak again` : sub;
  const busy = phase === 'thinking';
  return (
    <div className={`voice voice--${theme} voice--${size} is-${phase}`}>
      <div className="voice__stage">
        <span className="voice__ring voice__ring--1" />
        <span className="voice__ring voice__ring--2" />
        <span className="voice__ring voice__ring--3" />
        <button
          className="voice__btn"
          onClick={toggle}
          aria-label={phase === 'listening' ? 'Stop listening' : phase === 'speaking' ? 'Stop playback' : `Tap to speak in ${lang}`}
          aria-pressed={phase === 'listening'}
          disabled={busy}
        >
          {phase === 'thinking' ? <span className="voice__spinner" /> : phase === 'listening' || phase === 'speaking' ? <AudioWave active bars={9} height={34} /> : <LuMic size={size === 'lg' ? 44 : 34} strokeWidth={2} />}
        </button>
      </div>
      <p className="voice__title">{title}</p>
      <p className="voice__sub">{subtitle}</p>
    </div>
  );
}
