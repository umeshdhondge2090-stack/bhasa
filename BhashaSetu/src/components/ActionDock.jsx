import { useState } from 'react';
import { LuVolume2, LuTurtle, LuLightbulb, LuSmile } from 'react-icons/lu';
import { useVoice } from '../context/VoiceContext';

/** Floating physical-feeling controls around the interaction. */
export default function ActionDock({ theme = 'light', actions = ['repeat', 'slow', 'explain', 'encourage'] }) {
  const v = useVoice();
  const [pop, setPop] = useState(null);
  const all = {
    repeat: { label: 'Repeat', tip: 'Play the translation again', Icon: LuVolume2, tone: 'blue', run: v.repeat },
    slow: { label: 'Slow', tip: 'Play more slowly', Icon: LuTurtle, tone: 'green', run: v.slow },
    explain: { label: 'Explain', tip: 'Explain in simple words', Icon: LuLightbulb, tone: 'amber', run: v.explain },
    encourage: { label: 'Encourage', tip: 'Cheer the class on', Icon: LuSmile, tone: 'amber', run: v.encourage },
  };
  const press = (k) => {
    setPop(k);
    setTimeout(() => setPop((p) => (p === k ? null : p)), 380);
    all[k].run();
  };
  return (
    <div className={`dock dock--${theme}`} role="group" aria-label="Class actions">
      {actions.map((k) => {
        const a = all[k];
        return (
          <button key={k} className={`dock__btn tone-${a.tone} ${pop === k ? 'is-pop' : ''}`} onClick={() => press(k)} data-tip={a.tip} aria-label={`${a.label}: ${a.tip}`}>
            <span className="dock__icon">
              <a.Icon size={22} />
            </span>
            <span>{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}
