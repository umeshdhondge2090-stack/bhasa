import { useState, useRef, useEffect } from 'react';
import { LuArrowLeftRight, LuBell, LuSun, LuSunrise, LuMoon, LuUsers, LuUser, LuCheck } from 'react-icons/lu';
import { useApp } from '../context/AppContext';
import { useVoice } from '../context/VoiceContext';
import { CLASSES, LANGS } from '../data/content';
import Dropdown from './Dropdown';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', Icon: LuSunrise };
  if (h < 17) return { text: 'Good Afternoon', Icon: LuSun };
  return { text: 'Good Evening', Icon: LuMoon };
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const on = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', on);
    return () => document.removeEventListener('mousedown', on);
  }, [open]);
  return (
    <div className="dd" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications" aria-expanded={open} title="Notifications">
        <LuBell size={21} />
        <i className="icon-btn__badge" />
      </button>
      {open && (
        <div className="dd__menu dd__menu--right notes" role="dialog" aria-label="Notifications">
          <p className="eyebrow">Today</p>
          <div className="notes__item"><LuCheck size={16} /> Lesson 04 content is ready offline</div>
          <div className="notes__item"><LuCheck size={16} /> 3 answer sheets waiting for review</div>
        </div>
      )}
    </div>
  );
}

/** Class + language + notification + profile controls (shared by Home / Learn / Assess...). */
export function Controls() {
  const { klass, setKlass, direction, setDirection } = useApp();
  const voice = useVoice();
  const [from, to] = direction === 'hi-sat' ? [LANGS.hi, LANGS.sat] : [LANGS.sat, LANGS.hi];
  const swap = () => {
    voice.reset();
    setDirection(direction === 'hi-sat' ? 'sat-hi' : 'hi-sat');
  };
  return (
    <div className="controls">
      <Dropdown
        icon={<LuUsers size={19} />}
        label={klass}
        value={klass}
        items={CLASSES.map((c) => ({ label: c, value: c }))}
        onSelect={setKlass}
        className="pill-dd"
      />
      <button className="pill-btn" onClick={swap} title="Swap translation direction" aria-label={`Translating ${from.label} to ${to.label}. Tap to swap`}>
        <span>{from.label}</span>
        <LuArrowLeftRight size={17} className="swap" />
        <span>{to.label}</span>
      </button>
      <Notifications />
      <Dropdown
        icon={<span className="avatar-dot">T</span>}
        label="Teacher"
        align="right"
        items={[{ label: 'My profile', icon: <LuUser size={16} /> }]}
        className="pill-dd pill-dd--profile"
      />
    </div>
  );
}

export function HomeHeader() {
  const { text, Icon } = greeting();
  return (
    <header className="topbar">
      <div className="topbar__hello">
        <span className="topbar__sun"><Icon size={34} strokeWidth={1.8} /></span>
        <div>
          <h1>{text}, Teacher! <span aria-hidden="true">👋</span></h1>
          <p>Let's make today's lesson more inclusive.</p>
        </div>
      </div>
      <Controls />
    </header>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <header className="topbar">
      <div className="topbar__hello">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <Controls />
    </header>
  );
}
