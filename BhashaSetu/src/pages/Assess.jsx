import { useEffect, useRef, useState } from 'react';
import { LuCamera, LuCheck, LuX, LuArrowRight, LuImage, LuRotateCcw, LuSave } from 'react-icons/lu';
import { PageHeader } from '../components/Header';
import AvatarCompanion from '../components/avatar/AvatarCompanion';
import ProgressIndicator from '../components/ProgressIndicator';
import { SheetArt } from '../components/Illustrations';
import { useApp } from '../context/AppContext';
import { ANSWER_SHEET } from '../data/content';
import { classAverage, gradeFor } from '../lib/stats';

const STEPS = [
  { label: 'Scan' },
  { label: 'Processing' },
  { label: 'Convert' },
  { label: 'Review' },
  { label: 'Grade' },
  { label: 'Progress' },
];

export default function Assess({ navigate }) {
  const { records, addRecord, toast } = useApp();
  const [step, setStep] = useState(0);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [marks, setMarks] = useState(() => ANSWER_SHEET.questions.map((q) => q.answerHi === q.expected));
  const [before, setBefore] = useState(null);
  const file = useRef(null);
  const total = ANSWER_SHEET.questions.length;
  const score = marks.filter(Boolean).length;
  const pct = Math.round((score / total) * 100);
  const grade = gradeFor(pct);

  useEffect(() => {
    if (step !== 1) return undefined;
    const t = setTimeout(() => setStep(2), 2400);
    return () => clearTimeout(t);
  }, [step]);
  useEffect(() => () => sheetUrl && URL.revokeObjectURL(sheetUrl), [sheetUrl]);

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSheetUrl(URL.createObjectURL(f));
    setStep(1);
  };
  const save = () => {
    setBefore(classAverage(records));
    addRecord({ type: 'assessment', student: ANSWER_SHEET.student, score: pct, grade });
    toast(`Saved ${ANSWER_SHEET.student}'s result`, 'success');
    setStep(5);
  };
  const again = () => {
    setStep(0);
    setSheetUrl(null);
    setBefore(null);
    setMarks(ANSWER_SHEET.questions.map((q) => q.answerHi === q.expected));
  };

  const buddy = {
    0: ['idle', 'Place the sheet flat, then tap Scan.'],
    1: ['thinking', 'Reading the answers…'],
    2: ['happy', 'Answers are ready in Hindi!'],
    3: ['listening', 'Please check each mark.'],
    4: [pct >= 60 ? 'happy' : 'encouraging', pct >= 60 ? 'Nice result!' : "Let's help them practise."],
    5: ['success', 'Saved to progress!'],
  }[step];

  return (
    <div className="page assess">
      <PageHeader title="Assess" subtitle="Scan an answer sheet and review it in Hindi" />
      <div className="assess__steps surface">
        <ProgressIndicator variant="steps" steps={STEPS} current={step} />
      </div>

      <div className="assess__grid">
        <section className="assess__stage surface" aria-live="polite">
          {step === 0 && (
            <div className="scan" key="s0">
              <SheetArt />
              <h2>Scan the answer sheet</h2>
              <p>Hold the sheet flat in good light. Mundari answers are converted to Hindi for you.</p>
              <div className="scan__actions">
                <button className="btn btn--primary" onClick={() => file.current?.click()}>
                  <LuCamera size={20} /> Scan Answer Sheet
                </button>
                <button className="btn btn--ghost" onClick={() => setStep(1)}>
                  <LuImage size={19} /> Use sample sheet
                </button>
              </div>
              <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
            </div>
          )}

          {step === 1 && (
            <div className="scan" key="s1">
              {sheetUrl ? (
                <div className="scan__photo is-scanning"><img src={sheetUrl} alt="Scanned answer sheet" /><i /></div>
              ) : (
                <SheetArt scanning />
              )}
              <h2>Reading the sheet…</h2>
              <div className="scan__skeleton">
                <span className="skeleton" style={{ width: '80%' }} />
                <span className="skeleton" style={{ width: '58%' }} />
                <span className="skeleton" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div key="s2">
              <h2 className="stage-title">Language conversion</h2>
              <p className="stage-sub">{ANSWER_SHEET.student} • Mundari answers converted to Hindi</p>
              <ul className="qa-list">
                {ANSWER_SHEET.questions.map((q, i) => (
                  <li key={i} style={{ '--d': i }} className="rise">
                    <span className="qa-list__n">{i + 1}</span>
                    <span className="hi qa-list__q">{q.q}</span>
                    <span className="sat qa-list__from">{q.answerSat}</span>
                    <LuArrowRight size={16} className="qa-list__arrow" />
                    <b className="hi qa-list__to">{q.answerHi}</b>
                  </li>
                ))}
              </ul>
              <button className="btn btn--primary stage-cta" onClick={() => setStep(3)}>Continue to review <LuArrowRight className="arrow" size={19} /></button>
            </div>
          )}

          {step === 3 && (
            <div key="s3">
              <h2 className="stage-title">Teacher review</h2>
              <p className="stage-sub">Marks are suggested automatically. Tap to change any of them.</p>
              <ul className="qa-list">
                {ANSWER_SHEET.questions.map((q, i) => (
                  <li key={i}>
                    <span className="qa-list__n">{i + 1}</span>
                    <span className="hi qa-list__q">{q.q}</span>
                    <b className="hi qa-list__to">{q.answerHi}</b>
                    <span className="seg" role="group" aria-label={`Mark question ${i + 1}`}>
                      <button className={marks[i] ? 'is-on is-good' : ''} onClick={() => setMarks(marks.map((m, j) => (j === i ? true : m)))} aria-label="Correct" aria-pressed={marks[i]}><LuCheck size={18} /></button>
                      <button className={!marks[i] ? 'is-on is-bad' : ''} onClick={() => setMarks(marks.map((m, j) => (j === i ? false : m)))} aria-label="Incorrect" aria-pressed={!marks[i]}><LuX size={18} /></button>
                    </span>
                  </li>
                ))}
              </ul>
              <button className="btn btn--primary stage-cta" onClick={() => setStep(4)}>Confirm marks <LuArrowRight className="arrow" size={19} /></button>
            </div>
          )}

          {step === 4 && (
            <div className="grade" key="s4">
              <ProgressIndicator variant="ring" value={pct} label={`${score} of ${total}`} size={168} />
              <div className="grade__letter">Grade {grade}</div>
              <p>{ANSWER_SHEET.student}</p>
              <div className="grade__row">
                <button className="btn btn--ghost" onClick={() => setStep(3)}>Edit marks</button>
                <button className="btn btn--green" onClick={save}><LuSave size={18} /> Save to progress</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="grade" key="s5">
              <div className="saved-badge"><LuCheck size={34} strokeWidth={3} /></div>
              <h2>Saved to class progress</h2>
              <p>Class average {before !== null ? `${before}% → ` : ''}<b>{classAverage(records)}%</b></p>
              <div className="grade__row">
                <button className="btn btn--ghost" onClick={again}><LuRotateCcw size={18} /> Scan another</button>
                <button className="btn btn--primary" onClick={() => navigate('/progress')}>View progress <LuArrowRight className="arrow" size={19} /></button>
              </div>
            </div>
          )}
        </section>

        <aside className="assess__buddy surface">
          <div className="assess__buddy-char">
            <AvatarCompanion state={buddy[0]} bubble={buddy[1]} bubblePlacement="top" progress={100} />
          </div>
        </aside>
      </div>
    </div>
  );
}
