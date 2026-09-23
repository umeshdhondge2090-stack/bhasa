// Expression + gesture definitions for the character.
// Add a new state here and it is instantly available through <AvatarCompanion state="..." />.

export const AVATAR_STATES = [
  'idle',
  'listening',
  'thinking',
  'speaking',
  'happy',
  'encouraging',
  'excited',
  'success',
  'confused',
];

const LIP = '#B8524C';
const MOUTH_DARK = '#6B1F2A';

// All mouth paths share the same "M Q Q Z" structure so they can be morphed smoothly.
export const MOUTHS = {
  smile: { d: 'M182 229 Q200 237 218 229 Q200 242 182 229 Z', fill: LIP },
  soft: { d: 'M186 230 Q200 234 214 230 Q200 238 186 230 Z', fill: LIP },
  grin: { d: 'M180 226 Q200 241 220 226 Q200 250 180 226 Z', fill: LIP },
  pursed: { d: 'M192 231 Q200 227 208 231 Q200 237 192 231 Z', fill: LIP },
  smirk: { d: 'M187 233 Q199 227 213 231 Q201 238 187 233 Z', fill: LIP },
  talkA: { d: 'M185 228 Q200 229 215 228 Q200 253 185 228 Z', fill: MOUTH_DARK },
  talkMid: { d: 'M187 229 Q200 230 213 229 Q200 243 187 229 Z', fill: MOUTH_DARK },
  talkO: { d: 'M191 229 Q200 226 209 229 Q200 248 191 229 Z', fill: MOUTH_DARK },
};
export const TALK_CYCLE = ['talkMid', 'talkA', 'talkO', 'talkMid', 'smile', 'talkA', 'talkMid', 'talkO'];

// Eyebrow pairs (left, right). Same structure "M Q" for morphing.
export const BROWS = {
  neutral: { l: 'M158 172 Q172 166 187 170', r: 'M213 170 Q228 166 242 172' },
  raised: { l: 'M158 166 Q172 159 187 163', r: 'M213 163 Q228 159 242 166' },
  attentive: { l: 'M158 169 Q172 162 187 166', r: 'M213 166 Q228 162 242 169' },
  think: { l: 'M158 164 Q172 155 187 161', r: 'M213 170 Q228 168 242 173' },
  warm: { l: 'M158 174 Q172 166 187 165', r: 'M213 165 Q228 166 242 174' },
  confused: { l: 'M158 165 Q172 155 187 162', r: 'M213 173 Q228 171 242 176' },
  joy: { l: 'M158 168 Q172 159 187 165', r: 'M213 165 Q228 159 242 168' },
};

/**
 * mouth: key of MOUTHS or 'dynamic' (speaking, cycles visemes)
 * brow:  key of BROWS
 * eye:   vertical eye-open scale (happy = squint)
 * look:  pupil offset [x, y]
 * head:  [rotateDeg, x, y]
 * armA/armB: [upperArmDeg, forearmDeg]  (rest = [0,0])
 * blush: cheek opacity
 */
export const STATE_CONFIG = {
  idle: { mouth: 'smile', brow: 'neutral', eye: 1, look: [0, 0], head: [0, 0, 0], armA: [0, 0], armB: [0, 0], blush: 0.35, label: 'Friendly and relaxed' },
  listening: { mouth: 'soft', brow: 'attentive', eye: 1.06, look: [0, 0.6], head: [-3, 0, 3], armA: [0, 0], armB: [0, 0], blush: 0.35, label: 'Listening' },
  thinking: { mouth: 'pursed', brow: 'think', eye: 0.94, look: [3.4, -3], head: [7, 3, 0], armA: [0, 0], armB: [0, 0], blush: 0.3, label: 'Thinking' },
  speaking: { mouth: 'dynamic', brow: 'neutral', eye: 1, look: [0, 0], head: [0, 0, 0], armA: [10, 138], armB: [0, 0], blush: 0.38, label: 'Speaking' },
  happy: { mouth: 'grin', brow: 'joy', eye: 0.8, look: [0, 0], head: [0, 0, -2], armA: [8, 128], armB: [0, 0], blush: 0.6, label: 'Happy' },
  encouraging: { mouth: 'smile', brow: 'warm', eye: 0.96, look: [0, 0], head: [-2, 0, 2], armA: [14, 142], armB: [0, 0], blush: 0.42, label: 'Encouraging' },
  excited: { mouth: 'grin', brow: 'raised', eye: 1.1, look: [0, 0], head: [0, 0, -3], armA: [16, 150], armB: [0, 0], blush: 0.55, label: 'Excited' },
  success: { mouth: 'grin', brow: 'joy', eye: 0.8, look: [0, 0], head: [-2, 0, -4], armA: [14, 152], armB: [12, 138], blush: 0.6, label: 'Proud' },
  confused: { mouth: 'smirk', brow: 'confused', eye: 1.05, look: [-2.6, -1], head: [-8, -3, 0], armA: [0, 0], armB: [0, 0], blush: 0.3, label: 'Puzzled' },
};

export const DEFAULT_BUBBLE = {
  idle: null,
  listening: "I'm listening…",
  thinking: 'Understanding…',
  speaking: null,
  happy: 'Excellent!',
  encouraging: "Almost there! Let's try again.",
  excited: "Let's begin!",
  success: 'Lesson complete! 🎉',
  confused: "I didn't catch that. Try again?",
};
