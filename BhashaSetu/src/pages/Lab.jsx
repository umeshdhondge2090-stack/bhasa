import { useState } from 'react';
import AvatarCompanion from '../components/avatar/AvatarCompanion';
import { AVATAR_STATES, STATE_CONFIG } from '../components/avatar/avatarConfig';

/** Character lab: preview every expression state. Open with  #/lab  (not in the main navigation). */
export default function Lab() {
  const [state, setState] = useState('idle');
  return (
    <div className="page lab">
      <h1 className="lab__title">Character lab</h1>
      <div className="lab__grid">
        <div className="lab__stage surface">
          <div className="lab__char">
            <AvatarCompanion state={state} progress={100} bubblePlacement="top" />
          </div>
        </div>
        <div className="lab__list">
          {AVATAR_STATES.map((s) => (
            <button key={s} className={`lab__btn ${s === state ? 'is-active' : ''}`} onClick={() => setState(s)}>
              <strong>{s}</strong>
              <small>{STATE_CONFIG[s].label}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="lab__all">
        {AVATAR_STATES.map((s) => (
          <figure key={s} className="lab__cell surface">
            <div className="lab__mini"><AvatarCompanion state={s} showBubble={false} /></div>
            <figcaption>{s}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
