import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuBookOpen, LuMusic, LuPuzzle, LuMic, LuVolume2, LuArrowRight, LuCheck, LuRotateCcw, LuPlay } from 'react-icons/lu';
import { PageHeader } from '../components/Header';
import AvatarCompanion from '../components/avatar/AvatarCompanion';
import ProgressIndicator from '../components/ProgressIndicator';
import AudioWave from '../components/AudioWave';
import { WordArt } from '../components/Illustrations';
import { useApp } from '../context/AppContext';
import { engine } from '../services/engine';
import { RHYME, WORDS } from '../data/content';

const MODES = [
  { key: 'books', label: 'Bilingual Books', Icon: LuBookOpen },
  { key: 'rhymes', label: 'Rhymes & Poems', Icon: LuMusic },
  { key: 'activities', label: 'Activities', Icon: LuPuzzle },
  { key: 'speak', label: 'Speak & Practice', Icon: LuMic },
];
const FLOW = [{ label: 'Listen' }, { label: 'Read' }, { label: 'Speak' }, { label: 'Practice' }];
const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((x) => x[1]);

/** The companion that accompanies the student. Local state so Learn never fights the Live Class session. */
function useCompanion() {
  const [av, setAv] = useState({ state: 'excited', text: "Let's learn together!" });
  const t = useRef();
  const say = useCallback((state, text, ms = 2600) => {
    clearTimeout(t.current);
    setAv({ state, text });
    t.current = setTimeout(() => setAv({ state: 'idle', text: undefined }), ms);
  }, []);
  useEffect(() => {
    t.current = setTimeout(() => setAv({ state: 'idle', text: undefined }), 2800);
    return () => clearTimeout(t.current);
  }, []);
  return [av, say];
}

/* ----- shared bits ----- */
function MarkRow({ onCorrect, onRetry }) {
  return (
    <div className="mark-row">
      <button className="btn btn--green" onClick={onCorrect}><LuCheck size={19} /> Correct</button>
      <button className="btn btn--ghost" onClick={onRetry}><LuRotateCcw size={18} /> Try again</button>
    </div>
  );
}

function ListenBtn({ children, onClick, active }) {
  return (
    <button className={`listen-btn ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span>{active ? <AudioWave active bars={5} height={16} /> : <LuVolume2 size={20} />}</span>
      {children}
    </button>
  );
}

/* ----- Bilingual Books: one word at a time ----- */
function BooksFlow({ say, done }) {
  const [wi, setWi] = useState(0);
  const [stage, setStage] = useState(0);
  const [heard, setHeard] = useState(false);
  const [recording, setRecording] = useState(false);
  const [picked, setPicked] = useState(null);
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState(false);
  const word = WORDS[wi];
  const opts = useMemo(() => shuffle([word, ...shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 2)]), [word]);

  const hear = () => {
    setHeard(true);
    engine.speak(word.hi, { rate: 0.85 });
    say('speaking', word.sat, 2400);
  };
  const next = () => {
    if (stage < 3) {
      setStage(stage + 1);
      setPicked(null);
      if (stage === 1) say('encouraging', 'Now you say it!', 2200);
      return;
    }
    if (wi === WORDS.length - 1) {
      done(firstTry);
      return;
    }
    setWi(wi + 1);
    setStage(0);
    setHeard(false);
    setPicked(null);
    setMissed(false);
    say('excited', 'Next word!', 2000);
  };
  const choose = (w) => {
    setPicked(w.id);
    if (w.id === word.id) {
      say('happy', 'Excellent!', 2400);
      if (!missed) setFirstTry((n) => n + 1);
    } else {
      setMissed(true);
      say('encouraging', "Almost there! Let's try again.", 2800);
    }
  };
  const speakTry = () => {
    setRecording(true);
    say('listening', "I'm listening…", 1800);
    setTimeout(() => setRecording(false), 1800);
  };
  const canNext = (stage === 0 && heard) || stage === 1 || (stage === 2 && picked === 'ok') || (stage === 3 && picked === word.id);

  return (
    <div className="flow">
      <ProgressIndicator variant="steps" steps={FLOW} current={stage} />
      <div className="flow__stage" key={`${wi}-${stage}`}>
        <div className="flow__art"><WordArt id={word.id} size={132} /></div>
        {stage === 0 && (
          <>
            <p className="flow__hint">Listen to the word</p>
            <ListenBtn onClick={hear} active={false}>Hear “{word.hi}”</ListenBtn>
          </>
        )}
        {stage === 1 && (
          <div className="flow__words">
            <div><small>Hindi</small><strong className="hi">{word.hi}</strong></div>
            <div><small>Mundari</small><strong className="sat">{word.sat}</strong><em>{word.roman}</em></div>
          </div>
        )}
        {stage === 2 && (
          <>
            <p className="flow__hint">Ask the child to say <b className="sat">{word.sat}</b></p>
            <button className={`mic-mini ${recording ? 'is-on' : ''}`} onClick={speakTry} aria-label="Listen to the child">
              {recording ? <AudioWave active bars={7} height={26} /> : <LuMic size={30} />}
            </button>
            <MarkRow
              onCorrect={() => { setPicked('ok'); say('happy', 'Excellent!', 2400); }}
              onRetry={() => say('encouraging', "Almost there! Let's try again.", 2800)}
            />
          </>
        )}
        {stage === 3 && (
          <>
            <p className="flow__hint">Which word is <b className="hi">{word.hi}</b>?</p>
            <div className="choices">
              {opts.map((o) => (
                <button key={o.id} className={`choice sat ${picked === o.id ? (o.id === word.id ? 'is-right' : 'is-wrong') : ''}`} onClick={() => choose(o)}>
                  {o.sat}
                </button>
              ))}
            </div>
          </>
        )}
        <button className="btn btn--primary flow__next" onClick={next} disabled={!canNext}>
          {stage === 3 && wi === WORDS.length - 1 ? 'Finish lesson' : 'Continue'} <LuArrowRight className="arrow" size={19} />
        </button>
      </div>
      <p className="flow__count">Word {wi + 1} of {WORDS.length}</p>
    </div>
  );
}

/* ----- Rhymes ----- */
function RhymesFlow({ say, done }) {
  const [stage, setStage] = useState(0);
  const [line, setLine] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState(null);
  const timer = useRef();
  useEffect(() => () => { clearInterval(timer.current); engine.stopSpeaking(); }, []);
  const play = () => {
    clearInterval(timer.current);
    setPlaying(true);
    engine.speak(RHYME.lines.join(' '), { rate: 0.8 });
    say('speaking', RHYME.title, RHYME.lines.length * 1700);
    let i = 0;
    setLine(0);
    timer.current = setInterval(() => {
      i += 1;
      if (i >= RHYME.lines.length) {
        clearInterval(timer.current);
        setPlaying(false);
        setLine(-1);
        return;
      }
      setLine(i);
    }, 1700);
  };
  const options = ['पत्ता', 'पानी', 'फूल'];
  const next = () => {
    if (stage === 3) return done(1);
    setStage(stage + 1);
    return undefined;
  };
  const canNext = stage !== 3 || picked === 'पत्ता';
  return (
    <div className="flow">
      <ProgressIndicator variant="steps" steps={FLOW} current={stage} />
      <div className="flow__stage" key={stage}>
        <h3 className="rhyme__title hi">{RHYME.title}</h3>
        <div className="rhyme hi">
          {RHYME.lines.map((l, i) => (
            <p key={l} className={i === line ? 'is-now' : ''}>
              {stage === 3 && i === 0 ? (
                <>पेड़ हरा, <span className="blank">{picked || '____'}</span> हरा,</>
              ) : (
                l
              )}
            </p>
          ))}
        </div>
        {stage === 0 && <ListenBtn onClick={play} active={playing}>{playing ? 'Playing…' : 'Play the rhyme'}</ListenBtn>}
        {stage === 1 && (
          <div className="gloss">
            {RHYME.glossary.map((id) => {
              const w = WORDS.find((x) => x.id === id);
              return (
                <span key={id} className="gloss__chip"><WordArt id={id} size={34} /><b className="hi">{w.hi}</b><i className="sat">{w.sat}</i></span>
              );
            })}
          </div>
        )}
        {stage === 2 && (
          <>
            <p className="flow__hint">Sing along together</p>
            <ListenBtn onClick={play} active={playing}>{playing ? 'Singing…' : 'Sing with me'}</ListenBtn>
            <MarkRow onCorrect={() => say('happy', 'Wonderful singing!', 2400)} onRetry={() => say('encouraging', "Let's sing once more!", 2400)} />
          </>
        )}
        {stage === 3 && (
          <div className="choices">
            {options.map((o) => (
              <button key={o} className={`choice hi ${picked === o ? (o === 'पत्ता' ? 'is-right' : 'is-wrong') : ''}`} onClick={() => { setPicked(o); o === 'पत्ता' ? say('happy', 'Excellent!', 2400) : say('encouraging', "Almost there! Let's try again.", 2800); }}>
                {o}
              </button>
            ))}
          </div>
        )}
        <button className="btn btn--primary flow__next" onClick={next} disabled={!canNext}>
          {stage === 3 ? 'Finish lesson' : 'Continue'} <LuArrowRight className="arrow" size={19} />
        </button>
      </div>
    </div>
  );
}

/* ----- Activity: match words with pictures ----- */
function MatchGame({ say }) {
  const [sats] = useState(() => shuffle(WORDS));
  const [arts] = useState(() => shuffle(WORDS));
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);
  const pickWord = (id) => setSel(id);
  const pickArt = (id) => {
    if (!sel) {
      say('excited', 'Pick a word first!', 1800);
      return;
    }
    if (sel === id) {
      const m = [...matched, id];
      setMatched(m);
      setSel(null);
      say(m.length === WORDS.length ? 'success' : 'happy', m.length === WORDS.length ? 'All matched! 🎉' : 'Excellent!', 2600);
    } else {
      setWrong(id);
      setTimeout(() => setWrong(null), 500);
      say('encouraging', "Almost there! Let's try again.", 2400);
    }
  };
  return (
    <div className="flow">
      <p className="flow__hint">Match each Mundari word with its picture</p>
      <div className="match">
        <div className="match__col">
          {sats.map((w) => (
            <button key={w.id} disabled={matched.includes(w.id)} className={`choice sat ${sel === w.id ? 'is-picked' : ''} ${matched.includes(w.id) ? 'is-right' : ''}`} onClick={() => pickWord(w.id)}>
              {w.sat}
            </button>
          ))}
        </div>
        <div className="match__col match__col--art">
          {arts.map((w) => (
            <button key={w.id} disabled={matched.includes(w.id)} className={`art-tile ${matched.includes(w.id) ? 'is-right' : ''} ${wrong === w.id ? 'is-wrong' : ''}`} onClick={() => pickArt(w.id)} aria-label={w.en}>
              <WordArt id={w.id} size={72} />
            </button>
          ))}
        </div>
      </div>
      {matched.length === WORDS.length && <button className="btn btn--ghost" onClick={() => { setMatched([]); setSel(null); }}><LuRotateCcw size={18} /> Play again</button>}
    </div>
  );
}

/* ----- Speak & practice ----- */
function SpeakList({ say }) {
  const [playing, setPlaying] = useState(null);
  const play = (w) => {
    setPlaying(w.id);
    engine.speak(w.hi, { rate: 0.85 });
    say('speaking', w.sat, 1800);
    setTimeout(() => setPlaying(null), 1800);
  };
  return (
    <div className="flow">
      <p className="flow__hint">Play a word, let the child repeat, then mark it</p>
      <ul className="speak-list">
        {WORDS.map((w) => (
          <li key={w.id}>
            <WordArt id={w.id} size={54} />
            <div className="speak-list__words"><b className="hi">{w.hi}</b><span className="sat">{w.sat}</span></div>
            <ListenBtn onClick={() => play(w)} active={playing === w.id}><span className="sr-only">Play</span></ListenBtn>
            <button className="chip-mini chip-mini--good" onClick={() => say('happy', 'Excellent!', 2200)} aria-label="Mark correct"><LuCheck size={18} /></button>
            <button className="chip-mini" onClick={() => say('encouraging', "Almost there! Let's try again.", 2600)} aria-label="Try again"><LuRotateCcw size={16} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----- page ----- */
export default function Learn({ query }) {
  const { addRecord, toast } = useApp();
  const [mode, setMode] = useState(MODES.some((m) => m.key === query.mode) ? query.mode : 'books');
  const [av, say] = useCompanion();
  const [finished, setFinished] = useState(null);
  const [round, setRound] = useState(0);

  const [override, setAv2] = useState(null);
  const done = (correct) => {
    const total = mode === 'books' ? WORDS.length : 1;
    const pct = Math.round((correct / total) * 100);
    setFinished(pct);
    setAv2('success');
    addRecord({ type: 'lesson', title: mode === 'books' ? 'Nature Around Us' : RHYME.title, score: pct });
    toast('Lesson saved to progress', 'success');
  };
  const state = override || av.state;
  const bubble = override ? 'Lesson complete! 🎉' : av.text;
  const restart = () => {
    setFinished(null);
    setAv2(null);
    setRound((r) => r + 1);
    say('excited', "Let's learn together!", 2400);
  };
  const switchMode = (k) => {
    setMode(k);
    setFinished(null);
    setAv2(null);
    setRound((r) => r + 1);
    say('excited', "Let's learn together!", 2400);
  };

  return (
    <div className="page learn">
      <PageHeader title="Learn" subtitle="Nature Around Us • Lesson 04" />
      <div className="learn__tabs" role="tablist" aria-label="Learning mode">
        {MODES.map((m) => (
          <button key={m.key} role="tab" aria-selected={mode === m.key} className={`tab ${mode === m.key ? 'is-active' : ''}`} onClick={() => switchMode(m.key)}>
            <m.Icon size={19} /> <span>{m.label}</span>
          </button>
        ))}
      </div>
      <div className="learn__grid">
        <aside className="learn__buddy surface">
          <div className="learn__buddy-char">
            <AvatarCompanion state={state} bubble={bubble} bubblePlacement="top" progress={finished ?? 100} />
          </div>
        </aside>
        <section className="learn__stage surface" aria-live="polite">
          {finished !== null ? (
            <div className="done">
              <ProgressIndicator variant="ring" value={finished} label="Lesson score" size={150} />
              <h2>Lesson complete!</h2>
              <p>Great work — progress has been saved for {mode === 'books' ? 'Nature Around Us' : RHYME.title}.</p>
              <button className="btn btn--primary" onClick={restart}><LuPlay size={18} /> Learn again</button>
            </div>
          ) : (
            <div key={`${mode}-${round}`}>
              {mode === 'books' && <BooksFlow say={say} done={done} />}
              {mode === 'rhymes' && <RhymesFlow say={say} done={done} />}
              {mode === 'activities' && <MatchGame say={say} />}
              {mode === 'speak' && <SpeakList say={say} />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
