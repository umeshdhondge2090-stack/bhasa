import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../lib/storage';
import { CLASSES } from '../data/content';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const DEFAULT_PREFS = { largeText: false, reduceMotion: false, voiceSpeed: 0.6 };

export function AppProvider({ children }) {
  const [klass, setKlass] = useState(() => load('bs.class', CLASSES[0]));
  const [direction, setDirection] = useState(() => load('bs.direction', 'hi-sat')); // 'hi-sat' | 'sat-hi'
  const [prefs, setPrefsState] = useState(() => ({ ...DEFAULT_PREFS, ...load('bs.prefs', {}) }));
  const [records, setRecords] = useState(() => load('bs.records', []));
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  useEffect(() => save('bs.class', klass), [klass]);
  useEffect(() => save('bs.direction', direction), [direction]);
  useEffect(() => save('bs.prefs', prefs), [prefs]);
  useEffect(() => save('bs.records', records), [records]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('large-text', prefs.largeText);
    el.classList.toggle('reduce-motion', prefs.reduceMotion);
  }, [prefs]);

  const setPrefs = useCallback((patch) => setPrefsState((p) => ({ ...p, ...patch })), []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 260);
  }, []);

  const toast = useCallback(
    (message, type = 'info') => {
      const id = ++toastId.current;
      setToasts((t) => [...t.slice(-2), { id, message, type }]);
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast]
  );

  const addRecord = useCallback((rec) => setRecords((r) => [{ ...rec, at: Date.now() }, ...r].slice(0, 20)), []);

  const value = useMemo(
    () => ({ klass, setKlass, direction, setDirection, prefs, setPrefs, records, addRecord, toasts, toast, dismissToast }),
    [klass, direction, prefs, setPrefs, records, addRecord, toasts, toast, dismissToast]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
