import { useState } from 'react';
import { LuMic, LuVolume2, LuCopy, LuSend } from 'react-icons/lu';
import { useVoice } from '../context/VoiceContext';
import { useApp } from '../context/AppContext';
import { LANGS } from '../data/content';

function useLangs() {
  const { direction } = useApp();
  return direction === 'hi-sat' ? { from: LANGS.hi, to: LANGS.sat } : { from: LANGS.sat, to: LANGS.hi };
}

export function SpeechCard({ theme = 'light' }) {
  const v = useVoice();
  const { from } = useLangs();
  const [customText, setCustomText] = useState('');
  const empty = v.srcWords.length === 0;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (customText.trim()) {
      v.translateText(customText.trim());
      setCustomText('');
    }
  };

  return (
    <section className={`lang-card lang-card--speech lang-card--${theme}`} aria-label="Your speech">
      <header>
        <LuMic size={17} />
        <span>Your Speech ({from.label})</span>
      </header>
      <div className={`lang-card__body ${from.font}`} aria-live="polite">
        {empty ? (
          <span className="lang-card__placeholder">
            {v.phase === 'listening' ? 'Listening…' : 'Your words will appear here, or type below'}
          </span>
        ) : (
          <p>
            {v.srcWords.map((w, i) => (
              <span key={i} className="w">{w} </span>
            ))}
            {v.phase === 'listening' && <i className="caret" />}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '8px',
        padding: '8px 12px',
        borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--line)',
        background: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.5)',
      }}>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder={`Type custom ${from.label} to translate...`}
          style={{
            flex: 1,
            padding: '7px 12px',
            borderRadius: '10px',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #d3e2f2',
            background: theme === 'dark' ? 'rgba(255,255,255,0.15)' : '#ffffff',
            color: theme === 'dark' ? '#fff' : 'inherit',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn btn--primary"
          style={{
            minHeight: '34px',
            height: '34px',
            padding: '0 12px',
            fontSize: '0.82rem',
            borderRadius: '10px',
            gap: '6px',
          }}
          disabled={!customText.trim() || v.phase === 'thinking'}
        >
          <LuSend size={13} /> Translate
        </button>
      </form>
    </section>
  );
}

export function TranslationCard({ theme = 'light' }) {
  const v = useVoice();
  const { toast } = useApp();
  const { to } = useLangs();
  const thinking = v.phase === 'thinking';
  const started = v.dstWords.length > 0;
  const complete = v.sample && v.dstWords.length === v.dstTotal && !thinking && v.phase !== 'listening';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(v.dstText);
      toast('Translation copied', 'success');
    } catch {
      toast('Could not copy on this device', 'error');
    }
  };

  return (
    <section className={`lang-card lang-card--translation lang-card--${theme}`} aria-label="Translation">
      <header>
        <span>Translation ({to.label})</span>
        <button
          className="lang-card__play"
          onClick={v.repeat}
          aria-label="Play translation"
          title="Play translation"
          disabled={!v.sample}
        >
          <LuVolume2 size={18} />
        </button>
      </header>
      <div className={`lang-card__body ${to.font}`} aria-live="polite">
        {thinking ? (
          <div className="lang-card__skeleton">
            <span className="skeleton" style={{ width: '92%' }} />
            <span className="skeleton" style={{ width: '64%' }} />
          </div>
        ) : !started ? (
          <span className="lang-card__placeholder">Translation appears here</span>
        ) : (
          <p>
            {v.dstWords.map((w, i) => (
              <span key={i} className="w">{w} </span>
            ))}
          </p>
        )}
        {complete && (
          <button className="lang-card__copy" onClick={copy} aria-label="Copy translation" title="Copy">
            <LuCopy size={17} />
          </button>
        )}
      </div>
      {complete && v.sample && (
        <div className="lang-card__meaning">
          <strong>Meaning (for you)</strong>
          <span>{v.sample.meaning}</span>
        </div>
      )}
    </section>
  );
}

export default function TranslationPanel({ theme = 'light' }) {
  return (
    <div className="tp-stack">
      <SpeechCard theme={theme} />
      <TranslationCard theme={theme} />
    </div>
  );
}
