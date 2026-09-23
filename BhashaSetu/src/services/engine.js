import { SAMPLES } from '../data/content';

/**
 * Language engine adapter connecting UI to the local ML model backend (FastAPI) and TTS.
 */
const API_BASE =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api'
    : 'http://127.0.0.1:8000/api';

let cursor = 0;
// Current active HTML Audio element for neural TTS playback
let currentAudio = null;

// Ol Chiki -> Devanagari phonetic mapping for speech synthesis
const OL_CHIKI_VOWELS = {
  'ᱚ': ['अ', ''],
  'ᱟ': ['आ', 'ा'],
  'ᱤ': ['इ', 'ि'],
  'ᱩ': ['उ', 'ु'],
  'ᱮ': ['ए', 'े'],
  'ᱳ': ['ओ', 'ो'],
};

const OL_CHIKI_CONSONANTS = {
  'ᱛ': 'त', 'ᱜ': 'ग', 'ᱝ': 'ंग', 'ᱞ': 'ल',
  'ᱠ': 'क', 'ᱡ': 'ज', 'ᱢ': 'म', 'ᱣ': 'व',
  'ᱥ': 'स', 'ᱦ': 'ह', 'ᱧ': 'ञ', 'ᱨ': 'र',
  'ᱪ': 'च', 'ᱫ': 'द', 'ᱬ': 'ण', 'ᱭ': 'य',
  'ᱯ': 'प', 'ᱰ': 'ड', 'ᱱ': 'न', 'ᱲ': 'ड़',
  'ᱴ': 'ट', 'ᱵ': 'ब', 'ᱶ': 'व', 'ᱷ': 'ह',
};

export function olChikiToDevanagari(text) {
  if (!text) return '';
  const out = [];
  let prevConsonant = false;
  for (const char of text) {
    if (OL_CHIKI_VOWELS[char]) {
      const [vInit, vMatra] = OL_CHIKI_VOWELS[char];
      out.push(prevConsonant ? vMatra : vInit);
      prevConsonant = false;
    } else if (OL_CHIKI_CONSONANTS[char]) {
      out.push(OL_CHIKI_CONSONANTS[char]);
      prevConsonant = true;
    } else if (char === 'ᱸ' || char === 'ᱺ') {
      out.push('ँ');
      prevConsonant = false;
    } else if (char === 'ᱽ') {
      out.push('्');
      prevConsonant = false;
    } else if (char === '᱾') {
      out.push('।');
      prevConsonant = false;
    } else if (char === '᱿') {
      out.push('॥');
      prevConsonant = false;
    } else {
      out.push(char);
      prevConsonant = false;
    }
  }
  return out.join('');
}

export const engine = {
  mode: 'live', // 'live' or 'demo'
  modelInfo: { name: 'mT5 Hindi-Mundari', status: 'ready' },

  async checkBackend() {
    try {
      const res = await fetch(`${API_BASE}/status`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        this.mode = 'live';
        this.modelInfo = data;
        return true;
      }
    } catch (e) {
      console.warn('Backend server not reachable, using offline demo mode:', e);
    }
    this.mode = 'demo';
    return false;
  },

  async translate(text, { source_lang = 'hi', target_lang = 'mundari' } = {}) {
    if (!text || !text.trim()) return null;
    try {
      const res = await fetch(`${API_BASE}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          source_lang,
          target_lang,
          max_length: 128,
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          hi: source_lang === 'hi' ? data.source_text : data.translated_text,
          sat: source_lang === 'hi' ? data.translated_text : data.source_text,
          meaning: `Mundari translation: ${data.translated_text}`,
          explainHi: `मुंडारी अनुवाद: ${data.translated_text}`,
          isLiveModel: true,
        };
      }
    } catch (err) {
      console.warn('Live ML translation failed, fallback to demo phrase:', err);
    }
    return null;
  },

  nextUtterance() {
    const s = SAMPLES[cursor % SAMPLES.length];
    cursor += 1;
    return s;
  },

  // Speaks text (Mundari or Hindi) using Neural TTS or browser SpeechSynthesis
  async speak(text, { lang = 'sat', rate = 1, roman = '' } = {}) {
    if (!text || !text.trim()) return false;
    this.stopSpeaking();

    // Prepare phonetic text:
    // If text contains Ol Chiki script, transliterate it to phonetic Devanagari
    const hasOlChiki = /[\u1C50-\u1C7F]/.test(text);
    const phoneticText = hasOlChiki ? olChikiToDevanagari(text) : (roman || text);

    // 1. Try backend Neural TTS first
    try {
      const res = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: phoneticText,
          voice: 'hi-IN-SwaraNeural',
          rate: rate === 1 ? '+0%' : rate < 1 ? '-25%' : '+20%',
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.playbackRate = rate;
        currentAudio = audio;
        await audio.play();
        return true;
      }
    } catch {
      // Backend TTS failed or offline, fall back to browser Web Speech API
    }

    // 2. Fallback: Browser Web Speech API
    try {
      if (!('speechSynthesis' in window)) return false;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(phoneticText);
      u.lang = 'hi-IN'; // Indian phonetics reads the transliterated Mundari/Devanagari
      u.rate = rate;
      window.speechSynthesis.speak(u);
      return true;
    } catch {
      return false;
    }
  },

  stopSpeaking() {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {
        /* ignore */
      }
      currentAudio = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* ignore */
    }
  },
};

// Check backend availability on module load
if (typeof window !== 'undefined') {
  engine.checkBackend();
}
