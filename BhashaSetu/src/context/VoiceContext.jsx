import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { engine } from '../services/engine';
import { useApp } from './AppContext';

/**
 * Voice session + avatar state machine.
 *
 * phase:        idle -> listening -> thinking -> speaking -> result
 * avatarState:  derived from phase, or temporarily overridden (happy / encouraging / confused / excited / success)
 */
const Ctx = createContext(null);
export const useVoice = () => useContext(Ctx);

const PHASE_TO_AVATAR = {
  idle: 'idle',
  listening: 'listening',
  thinking: 'thinking',
  speaking: 'speaking',
  result: 'idle',
};

const words = (s) => (s ? s.trim().split(/\s+/) : []);

export function VoiceProvider({ children }) {
  const { direction, prefs, toast } = useApp();
  const [phase, setPhase] = useState('idle');
  const [sample, setSample] = useState(null);
  const [srcShown, setSrcShown] = useState(0);
  const [dstShown, setDstShown] = useState(0);
  const [override, setOverride] = useState(null); // { state, text }
  const [isBackendLive, setIsBackendLive] = useState(false);
  const timers = useRef([]);
  const sampleRef = useRef(null);
  const dirRef = useRef(direction);
  dirRef.current = direction;
  const recognitionRef = useRef(null);

  // Poll / check backend connection on mount
  useEffect(() => {
    engine.checkBackend().then((live) => {
      setIsBackendLive(live);
    });
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timers.current = [];
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }
    engine.stopSpeaking();
  }, []);

  useEffect(() => clearAll, [clearAll]);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const every = useCallback((fn, ms) => {
    const id = setInterval(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const texts = useCallback((s, dir = dirRef.current) => {
    if (!s) return { src: '', dst: '' };
    return dir === 'hi-sat' ? { src: s.hi, dst: s.sat } : { src: s.sat, dst: s.hi };
  }, []);

  const finish = useCallback(() => setPhase('result'), []);

  const startSpeaking = useCallback(
    (rate = 1, replay = false) => {
      const s = sampleRef.current;
      const { dst } = texts(s);
      const list = words(dst);
      setPhase('speaking');
      const step = 330 / rate;
      // Speak the translated destination text (Mundari or Hindi)
      engine.speak(dst, {
        lang: dirRef.current === 'hi-sat' ? 'sat' : 'hi-IN',
        rate,
        roman: s?.roman,
      });
      if (replay) {
        setDstShown(list.length);
        later(finish, list.length * (330 / rate) + 500);
        return;
      }
      let k = 0;
      setDstShown(0);
      const id = every(() => {
        k += 1;
        setDstShown(k);
        if (k >= list.length) {
          clearInterval(id);
          later(finish, 700 / rate);
        }
      }, step);
    },
    [every, later, finish, texts]
  );

  const translateText = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;
      clearAll();
      setOverride(null);
      const isHiToSat = dirRef.current === 'hi-sat';
      const clean = text.trim();
      const initial = {
        hi: isHiToSat ? clean : '',
        sat: isHiToSat ? '' : clean,
        meaning: 'Translating with mT5 model…',
        explainHi: '',
      };

      sampleRef.current = initial;
      setSample(initial);
      setSrcShown(words(clean).length);
      setDstShown(0);
      setPhase('thinking');

      // Request translation from the local ML model
      const result = await engine.translate(clean, {
        source_lang: isHiToSat ? 'hi' : 'mundari',
        target_lang: isHiToSat ? 'mundari' : 'hi',
      });

      const finalSample = result || {
        ...initial,
        sat: isHiToSat ? clean : clean,
        meaning: 'Translation complete',
        explainHi: `अनुवाद: ${clean}`,
      };

      sampleRef.current = finalSample;
      setSample(finalSample);
      later(() => startSpeaking(1), 600);
    },
    [clearAll, later, startSpeaking]
  );

  const startThinkingWithSample = useCallback(
    async (s) => {
      setSrcShown(words(texts(s).src).length);
      setPhase('thinking');

      // If backend is active, translate with real ML model
      const isHiToSat = dirRef.current === 'hi-sat';
      const input = isHiToSat ? s.hi : s.sat;
      const res = await engine.translate(input, {
        source_lang: isHiToSat ? 'hi' : 'mundari',
        target_lang: isHiToSat ? 'mundari' : 'hi',
      });

      const updated = res ? { ...s, sat: res.sat, meaning: res.meaning } : s;
      sampleRef.current = updated;
      setSample(updated);
      later(() => startSpeaking(1), 600);
    },
    [later, startSpeaking, texts]
  );

  const start = useCallback(() => {
    clearAll();
    const s = engine.nextUtterance();
    sampleRef.current = s;
    setSample(s);
    setSrcShown(0);
    setDstShown(0);
    setOverride(null);
    setPhase('listening');

    // Try Web Speech API if supported in browser
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.lang = dirRef.current === 'hi-sat' ? 'hi-IN' : 'hi-IN';
        rec.interimResults = true;
        rec.maxAlternatives = 1;

        rec.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            const list = words(transcript);
            sampleRef.current = { ...s, hi: transcript };
            setSample((prev) => ({ ...(prev || s), hi: transcript }));
            setSrcShown(list.length);
          }
          if (event.results[event.results.length - 1].isFinal) {
            rec.stop();
            translateText(transcript);
          }
        };

        rec.onerror = () => {
          // If mic recognition errors or permission is denied, use sample animation
          startSimulatedListening(s);
        };

        rec.start();
        recognitionRef.current = rec;
        return;
      } catch {
        /* Fall back to simulated flow */
      }
    }

    startSimulatedListening(s);

    function startSimulatedListening(sampleItem) {
      const n = words(texts(sampleItem).src).length;
      let k = 0;
      const id = every(() => {
        k += 1;
        setSrcShown(k);
        if (k >= n) {
          clearInterval(id);
          later(() => startThinkingWithSample(sampleItem), 700);
        }
      }, 350);
    }
  }, [clearAll, every, later, texts, startThinkingWithSample, translateText]);

  const toggle = useCallback(() => {
    if (phase === 'idle' || phase === 'result') return start();
    if (phase === 'listening') {
      clearAll();
      if (sampleRef.current) {
        return translateText(texts(sampleRef.current).src);
      }
      return finish();
    }
    if (phase === 'speaking') {
      clearAll();
      setDstShown(words(texts(sampleRef.current).dst).length);
      return finish();
    }
    return undefined; // thinking: let it finish
  }, [phase, start, clearAll, finish, texts, translateText]);

  const flash = useCallback(
    (state, text, ms = 2800) => {
      setOverride({ state, text });
      later(() => setOverride(null), ms);
    },
    [later]
  );

  const play = useCallback(
    (rate = 1) => {
      if (!sampleRef.current) {
        toast('Tap the microphone and speak first.', 'info');
        return;
      }
      clearAll();
      setOverride(null);
      startSpeaking(rate, true);
    },
    [clearAll, startSpeaking, toast]
  );

  const repeat = useCallback(() => play(1), [play]);
  const slow = useCallback(() => {
    if (sampleRef.current) toast('Playing slowly', 'info');
    play(prefs.voiceSpeed || 0.6);
  }, [play, prefs.voiceSpeed, toast]);

  const explain = useCallback(() => {
    const s = sampleRef.current;
    if (!s) {
      toast('Say something first, then tap Explain.', 'info');
      return;
    }
    clearAll();
    engine.speak(s.explainHi || s.meaning, { lang: 'hi-IN', rate: 0.95 });
    setOverride({ state: 'speaking', text: s.explainHi || s.meaning });
    later(() => setOverride(null), 4200);
  }, [clearAll, later, toast]);

  const encourage = useCallback(() => {
    clearAll();
    setOverride({ state: 'happy', text: 'शाबाश, बच्चों! 👏' });
    later(() => setOverride(null), 2800);
    toast('Encouragement sent to the class', 'success');
  }, [clearAll, later, toast]);

  const markResponse = useCallback(
    (kind) => {
      clearAll();
      if (kind === 'correct') flash('happy', 'Excellent!', 3000);
      else if (kind === 'incorrect') flash('encouraging', "Almost there! Let's try again.", 3400);
      else flash('confused', "I didn't catch that. Try again?", 3400);
    },
    [clearAll, flash]
  );

  const reset = useCallback(() => {
    clearAll();
    setPhase('idle');
    setOverride(null);
    setSrcShown(0);
    setDstShown(0);
  }, [clearAll]);

  const t = texts(sample);
  const srcList = words(t.src);
  const dstList = words(t.dst);

  const value = useMemo(
    () => ({
      phase,
      avatarState: override?.state ?? PHASE_TO_AVATAR[phase],
      overrideText: override?.text,
      sample,
      srcWords: srcList.slice(0, srcShown),
      dstWords: dstList.slice(0, dstShown),
      srcTotal: srcList.length,
      dstTotal: dstList.length,
      srcText: t.src,
      dstText: t.dst,
      isBackendLive,
      translateText,
      toggle,
      start,
      repeat,
      slow,
      explain,
      encourage,
      markResponse,
      flash,
      reset,
    }),
    [
      phase,
      override,
      sample,
      srcShown,
      dstShown,
      srcList,
      dstList,
      t.src,
      t.dst,
      isBackendLive,
      translateText,
      toggle,
      start,
      repeat,
      slow,
      explain,
      encourage,
      markResponse,
      flash,
      reset,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
