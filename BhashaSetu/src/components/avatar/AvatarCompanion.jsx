import { useEffect, useRef, useState } from 'react';
import { useMorph } from '../../lib/morph';
import AudioWave from '../AudioWave';
import { BROWS, DEFAULT_BUBBLE, MOUTHS, STATE_CONFIG, TALK_CYCLE } from './avatarConfig';
import './avatar.css';

const SKIN = '#C98B5E';
const SKIN_SHADE = '#AE7248';
const HAIR = '#2A1A16';
const KURTA = '#F4EADB';
const BLUE = '#1688F8';
const NAVY = '#0B4FB3';

/* ------------------------------------------------------------------ */
/* Small parts                                                          */
/* ------------------------------------------------------------------ */

function Mouth({ shape }) {
  const m = MOUTHS[shape] || MOUTHS.smile;
  const d = useMorph(m.d, 120);
  return <path d={d} style={{ fill: m.fill, transition: 'fill .15s' }} />;
}

function Brows({ kind }) {
  const b = BROWS[kind] || BROWS.neutral;
  const l = useMorph(b.l, 260);
  const r = useMorph(b.r, 260);
  return (
    <g fill="none" stroke={HAIR} strokeWidth="3.6" strokeLinecap="round">
      <path d={l} />
      <path d={r} />
    </g>
  );
}

function Eye({ cx, open, look }) {
  return (
    <g className="av-eye" style={{ transformOrigin: `${cx}px 192px`, transform: `scaleY(${open})` }}>
      <ellipse cx={cx} cy="192" rx="11.5" ry="9" fill="#fff" />
      <g className="av-pupil" style={{ transform: `translate(${look[0]}px, ${look[1]}px)` }}>
        <circle cx={cx} cy="192" r="6.6" fill="#5A3322" />
        <circle cx={cx} cy="192" r="3.6" fill="#1B0F0B" />
        <circle cx={cx + 2.4} cy="189.6" r="1.8" fill="#fff" />
      </g>
      <path d={`M${cx - 13.5} 191 Q${cx} 179 ${cx + 13.5} 191`} fill="none" stroke="#1F120E" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Arm({ mirrored, pose }) {
  const [up, fore] = pose;
  return (
    <g transform={mirrored ? 'translate(400 0) scale(-1 1)' : undefined}>
      <g className="av-limb" style={{ transformOrigin: '126px 336px', transform: `rotate(${up}deg)` }}>
        <path d="M126 338 L92 414" stroke={KURTA} strokeWidth="42" strokeLinecap="round" fill="none" />
        <path d="M118 356 L104 386" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 7" fill="none" />
        <g className="av-limb" style={{ transformOrigin: '92px 414px', transform: `rotate(${fore}deg)` }}>
          <g className="av-fore-anim">
            <path d="M92 416 L101 474" stroke={SKIN} strokeWidth="19" strokeLinecap="round" fill="none" />
            <path d="M92 412 L95 438" stroke={KURTA} strokeWidth="36" strokeLinecap="round" fill="none" />
            <path d="M76 436 Q94 444 112 438" stroke={BLUE} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M89 452 Q97 456 105 452" stroke="#FFB52E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <g transform="translate(102 486)">
              <ellipse rx="11.5" ry="16" fill={SKIN} />
              <ellipse cx="-11" cy="0" rx="4.6" ry="10" transform="rotate(22 -11 0)" fill={SKIN} />
              <path d="M-4 -8 L-4 -1 M2 -9 L2 -1 M7 -7 L7 -1" stroke={SKIN_SHADE} strokeWidth="1.3" strokeLinecap="round" opacity=".55" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

const BRAID = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.6) / 9.4;
  const [x0, y0, x1, y1, x2, y2] = [156, 292, 122, 356, 136, 452];
  const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
  const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
  return { x, y };
});

function Braid() {
  return (
    <g>
      <path d="M156 292 Q122 356 136 452" stroke={HAIR} strokeWidth="30" strokeLinecap="round" fill="none" />
      {BRAID.map((b, i) => (
        <path key={i} d={`M${b.x - 12} ${b.y - 4} Q${b.x} ${b.y + 7} ${b.x + 12} ${b.y - 4}`} stroke="#4E3229" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
      <rect x="121" y="452" width="30" height="9" rx="4" fill="#D6402E" />
      <path d="M128 461 L124 486 M136 461 L136 490 M144 461 L148 486" stroke={HAIR} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

const Star = ({ x, y, s = 1, delay = 0, color = '#FFB52E' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      className="av-sparkle"
      style={{ animationDelay: `${delay}s` }}
      d="M0 -11 Q1.2 -1.2 11 0 Q1.2 1.2 0 11 Q-1.2 1.2 -11 0 Q-1.2 -1.2 0 -11Z"
      fill={color}
    />
  </g>
);

const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return {
    dx: Math.cos(a) * (90 + (i % 3) * 30),
    dy: -30 - Math.abs(Math.sin(a)) * 110 - (i % 2) * 20,
    color: ['#1688F8', '#00AEEF', '#FFB52E', '#16A36A'][i % 4],
    delay: (i % 5) * 0.06,
  };
});

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

/**
 * <AvatarCompanion state="idle|listening|thinking|speaking|happy|encouraging|excited|success|confused" />
 *
 * - bubble:   string to show in the speech bubble (overrides the default for the state). null hides it.
 * - greeting: bubble shown in the idle state (default "Johar, Teacher! 👋").
 * - progress: 0-100, shown inside the bubble on "success".
 */
export default function AvatarCompanion({
  state = 'idle',
  bubble,
  greeting = 'Johar, Teacher! 👋',
  showBubble = true,
  progress,
  className = '',
  bubblePlacement = 'side', // 'side' | 'top'
}) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.idle;
  const [blink, setBlink] = useState(false);
  const [glance, setGlance] = useState([0, 0]);
  const [viseme, setViseme] = useState('talkMid');
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // natural blinking
  useEffect(() => {
    let t1;
    let t2;
    const loop = () => {
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => setBlink(false), 130);
        loop();
      }, 2300 + Math.random() * 3400);
    };
    loop();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // small idle glances
  useEffect(() => {
    if (state !== 'idle') {
      setGlance([0, 0]);
      return undefined;
    }
    let t1;
    let t2;
    const loop = () => {
      t1 = setTimeout(() => {
        setGlance([(Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random()), 0.4]);
        t2 = setTimeout(() => setGlance([0, 0]), 1300);
        loop();
      }, 3800 + Math.random() * 3000);
    };
    loop();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [state]);

  // mouth movement while speaking
  useEffect(() => {
    if (state !== 'speaking') return undefined;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setViseme(TALK_CYCLE[(i + Math.floor(Math.random() * 2)) % TALK_CYCLE.length]);
    }, 150);
    return () => clearInterval(id);
  }, [state]);

  const mouth = cfg.mouth === 'dynamic' ? viseme : cfg.mouth;
  const look = [cfg.look[0] + glance[0], cfg.look[1] + glance[1]];
  const eyeOpen = blink ? 0.06 : cfg.eye;
  const [hr, hx, hy] = cfg.head;

  const text = bubble !== undefined ? bubble : state === 'idle' ? greeting : DEFAULT_BUBBLE[state];
  const showTextBubble = showBubble && (text || state === 'speaking');

  return (
    <div className={`avatar ${className}`} data-state={state}>
      {showTextBubble && (
        <div className={`avatar__bubble avatar__bubble--${bubblePlacement} is-${state}`} key={state}>
          {state === 'speaking' && <AudioWave active bars={7} height={16} />}
          {text && <span className="avatar__bubble-text">{text}</span>}
          {state === 'success' && typeof progress === 'number' && (
            <span className="avatar__bubble-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </span>
          )}
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {DEFAULT_BUBBLE[state] || ''}
      </span>

      <svg className="avatar__svg" viewBox="0 0 400 560" role="img" aria-label={`Johar companion — ${cfg.label}`}>
        <defs>
          <linearGradient id="avKurta" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 300) scale(1 260)">
            <stop offset="0" stopColor="#FBF4E8" />
            <stop offset="1" stopColor="#EADCC4" />
          </linearGradient>
          <linearGradient id="avDupatta" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1B7DE6" />
            <stop offset="1" stopColor={NAVY} />
          </linearGradient>
          <radialGradient id="avFace" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#D6976A" />
            <stop offset="1" stopColor="#C58558" />
          </radialGradient>
        </defs>

        {/* ambient state effects (behind the character) */}
        {state === 'listening' && (
          <g className="av-fx" fill="none" stroke="#00AEEF" strokeWidth="3.4" strokeLinecap="round">
            <path className="av-hear" style={{ animationDelay: '0s' }} d="M106 168 Q92 195 106 222" />
            <path className="av-hear" style={{ animationDelay: '.25s' }} d="M90 152 Q66 195 90 238" />
            <path className="av-hear" style={{ animationDelay: '0s' }} d="M294 168 Q308 195 294 222" />
            <path className="av-hear" style={{ animationDelay: '.25s' }} d="M310 152 Q334 195 310 238" />
          </g>
        )}
        {state === 'thinking' && (
          <g className="av-fx" fill="#fff" stroke={BLUE} strokeWidth="3">
            <circle className="av-dot" style={{ animationDelay: '0s' }} cx="286" cy="128" r="6" />
            <circle className="av-dot" style={{ animationDelay: '.2s' }} cx="308" cy="108" r="8" />
            <circle className="av-dot" style={{ animationDelay: '.4s' }} cx="336" cy="92" r="10" />
          </g>
        )}
        {state === 'confused' && (
          <g className="av-fx">
            <text className="av-qmark" x="292" y="128" fontSize="46" fontWeight="700" fill={BLUE}>
              ?
            </text>
          </g>
        )}

        <g className="av-breath">
          {/* right arm (behind body) */}
          <Arm mirrored pose={cfg.armB} />

          {/* torso */}
          <path
            d="M104 356 Q104 324 150 311 L178 300 Q200 318 222 300 L250 311 Q296 324 296 356 L320 560 L80 560 Z"
            fill="url(#avKurta)"
          />
          <path d="M200 338 L200 560" stroke="#E2D2B8" strokeWidth="2" />
          <path d="M200 350 L200 540" stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" strokeDasharray="0.1 9" />
          {/* hem embroidery */}
          <path d="M84 528 Q200 548 316 528" stroke={NAVY} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".9" />
          <path d="M86 540 Q200 560 314 540" stroke="#FFB52E" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="1 7" />
          {/* skin V-neck + embroidery */}
          <path d="M168 298 Q200 348 232 298 L232 262 L168 262 Z" fill={SKIN_SHADE} />
          <path d="M163 302 Q200 358 237 302" stroke={BLUE} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="0.1 8" />
          <path d="M160 297 Q200 352 240 297" stroke="#FFB52E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".9" />
          {/* dupatta */}
          <path d="M236 304 Q282 312 298 350 L324 560 L262 560 Q270 468 248 404 Q240 352 222 322 Z" fill="url(#avDupatta)" />
          <path d="M262 348 Q276 440 286 560" stroke="#fff" strokeOpacity=".18" strokeWidth="3" fill="none" />
          <path d="M252 340 Q262 380 268 430" stroke="#fff" strokeOpacity=".12" strokeWidth="2" fill="none" />

          {/* braid over the shoulder */}
          <Braid />

          {/* left arm (gesturing) */}
          <Arm pose={cfg.armA} />

          {/* head */}
          <g className="av-head-state" style={{ transformOrigin: '200px 300px', transform: `translate(${hx}px, ${hy}px) rotate(${hr}deg)` }}>
            <g className="av-head-anim">
              {/* back hair (hair is tied into a braid) */}
              <path d="M132 184 Q130 94 200 90 Q270 94 268 184 Q266 238 246 268 L154 268 Q134 238 132 184Z" fill={HAIR} />
              {/* neck */}
              <path d="M176 236 L176 318 Q200 340 224 318 L224 236 Z" fill={SKIN_SHADE} />
              <ellipse cx="200" cy="262" rx="26" ry="10" fill="#8C5634" opacity=".35" />
              {/* ears + earrings */}
              <ellipse cx="139" cy="203" rx="10" ry="15" fill={SKIN} />
              <ellipse cx="261" cy="203" rx="10" ry="15" fill={SKIN} />
              <circle cx="138" cy="224" r="4.4" fill="#FFB52E" />
              <circle cx="262" cy="224" r="4.4" fill="#FFB52E" />
              <path d="M138 228 L138 236" stroke="#FFB52E" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M262 228 L262 236" stroke="#FFB52E" strokeWidth="2.4" strokeLinecap="round" />
              {/* face */}
              <path d="M140 186 Q140 126 200 124 Q260 126 260 186 Q260 252 200 270 Q140 252 140 186Z" fill="url(#avFace)" />
              {/* cheeks */}
              <ellipse cx="160" cy="221" rx="14" ry="9" fill="#E27F6B" style={{ opacity: cfg.blush, transition: 'opacity .5s' }} />
              <ellipse cx="240" cy="221" rx="14" ry="9" fill="#E27F6B" style={{ opacity: cfg.blush, transition: 'opacity .5s' }} />
              {/* eyes */}
              <Eye cx={172} open={eyeOpen} look={look} />
              <Eye cx={228} open={eyeOpen} look={look} />
              <Brows kind={cfg.brow} />
              {/* nose */}
              <path d="M194 214 Q200 220 206 214" stroke={SKIN_SHADE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="200" cy="158" r="2.7" fill="#D6402E" />
              <Mouth shape={mouth} />
              {/* front hair with centre parting */}
              <path
                d="M138 184 Q128 112 200 108 Q272 112 262 184 Q254 142 228 139 Q206 137 200 127 Q194 137 172 139 Q146 142 138 184Z"
                fill={HAIR}
              />
              <path d="M160 128 Q200 108 240 128" stroke="#fff" strokeOpacity=".1" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* flower in hair */}
              <g transform="translate(246 132)">
                {[0, 72, 144, 216, 288].map((r) => (
                  <ellipse key={r} cx="0" cy="-7" rx="4.6" ry="7" fill="#FFB52E" transform={`rotate(${r})`} />
                ))}
                <circle r="3.4" fill="#D6402E" />
              </g>
            </g>
          </g>
        </g>

        {/* celebration effects (in front) */}
        {(state === 'happy' || state === 'success' || state === 'excited') && (
          <g className="av-fx">
            <Star x={112} y={122} s={1} delay={0} />
            <Star x={292} y={138} s={0.8} delay={0.15} color="#00AEEF" />
            <Star x={104} y={214} s={0.6} delay={0.3} color="#1688F8" />
            {state !== 'excited' && <Star x={302} y={216} s={0.7} delay={0.45} />}
          </g>
        )}
        {state === 'success' && (
          <g className="av-fx">
            {CONFETTI.map((c, i) => (
              <circle
                key={i}
                className="av-confetti"
                cx="200"
                cy="150"
                r="4.2"
                fill={c.color}
                style={{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, animationDelay: `${c.delay}s` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
