/* Small original illustrations used across the app. */

export function WordArt({ id, size = 120 }) {
  const common = { width: size, height: size, viewBox: '0 0 120 120', 'aria-hidden': true };
  if (id === 'tree')
    return (
      <svg {...common}>
        <ellipse cx="60" cy="106" rx="38" ry="7" fill="#0069D9" opacity=".1" />
        <rect x="54" y="62" width="12" height="42" rx="4" fill="#8A5A34" />
        <circle cx="60" cy="44" r="30" fill="#3E9E62" />
        <circle cx="38" cy="58" r="18" fill="#4BAF6F" />
        <circle cx="82" cy="58" r="18" fill="#4BAF6F" />
        <circle cx="52" cy="36" r="8" fill="#63C685" opacity=".7" />
      </svg>
    );
  if (id === 'leaf')
    return (
      <svg {...common}>
        <ellipse cx="60" cy="106" rx="34" ry="6" fill="#0069D9" opacity=".1" />
        <path d="M60 100 C20 84 18 40 60 14 C102 40 100 84 60 100Z" fill="#4BAF6F" />
        <path d="M60 96 L60 30 M60 74 L40 58 M60 62 L80 46 M60 84 L44 72" stroke="#2F8A54" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    );
  if (id === 'flower')
    return (
      <svg {...common}>
        <ellipse cx="60" cy="108" rx="26" ry="5" fill="#0069D9" opacity=".1" />
        <path d="M60 106 L60 62" stroke="#2F8A54" strokeWidth="5" strokeLinecap="round" />
        <path d="M60 92 Q40 88 36 74 Q54 74 60 90Z" fill="#4BAF6F" />
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="60" cy="34" rx="11" ry="19" fill="#FF7A59" transform={`rotate(${r} 60 52)`} />
        ))}
        <circle cx="60" cy="52" r="12" fill="#FFB52E" />
      </svg>
    );
  return (
    <svg {...common}>
      <ellipse cx="60" cy="108" rx="30" ry="5" fill="#0069D9" opacity=".1" />
      <path d="M60 12 C60 12 24 54 24 76 a36 36 0 0 0 72 0 C96 54 60 12 60 12Z" fill="#1688F8" />
      <path d="M44 78 a18 18 0 0 0 14 18" stroke="#fff" strokeOpacity=".7" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function LessonArt() {
  return (
    <svg viewBox="0 0 160 130" role="img" aria-label="A tree in a green meadow">
      <defs>
        <linearGradient id="laSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FD3FF" />
          <stop offset="1" stopColor="#E6F6FF" />
        </linearGradient>
      </defs>
      <rect width="160" height="130" fill="url(#laSky)" />
      <circle cx="132" cy="26" r="13" fill="#FFE27A" />
      <path d="M0 92 Q40 66 86 88 Q124 70 160 90 L160 130 L0 130Z" fill="#7BC38D" />
      <path d="M0 108 Q50 88 100 106 Q136 96 160 108 L160 130 L0 130Z" fill="#4BAF6F" />
      <rect x="72" y="62" width="12" height="46" fill="#8A5A34" />
      <circle cx="78" cy="48" r="30" fill="#3E9E62" />
      <circle cx="56" cy="62" r="18" fill="#4BAF6F" />
      <circle cx="102" cy="62" r="18" fill="#4BAF6F" />
      <circle cx="68" cy="40" r="7" fill="#63C685" opacity=".8" />
    </svg>
  );
}

/** Resource artwork: icon in a soft blob with a few decorative shapes. Colour lives only here. */
const TONES = {
  orange: ['#FFE9DA', '#F0752C', '#FFB27A'],
  teal: ['#DDF6F1', '#12A58F', '#7ADBC9'],
  violet: ['#EDE6FF', '#7A4DE8', '#B79CFF'],
  amber: ['#FFF1D2', '#F29A0B', '#FFC968'],
};
export function ResourceArt({ kind, tone }) {
  const [bg, fg, soft] = TONES[tone] || TONES.orange;
  return (
    <svg className="res-art" viewBox="0 0 84 84" aria-hidden="true">
      <circle cx="42" cy="42" r="40" fill={bg} />
      <circle cx="70" cy="18" r="5" fill={soft} opacity=".8" />
      <circle cx="12" cy="66" r="4" fill={soft} opacity=".7" />
      {kind === 'books' && (
        <g>
          <path d="M14 26c9-3 18-2 28 4 10-6 19-7 28-4v34c-9-3-18-2-28 4-10-6-19-7-28-4Z" fill={fg} />
          <path d="M42 30v34" stroke="#fff" strokeWidth="2.5" />
          <path d="M20 34c6-1 12 0 18 3M20 42c6-1 12 0 18 3M64 34c-6-1-12 0-18 3M64 42c-6-1-12 0-18 3" stroke="#fff" strokeOpacity=".7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
      )}
      {kind === 'rhymes' && (
        <g fill={fg}>
          <path d="M34 54V26l26-6v28" stroke={fg} strokeWidth="5" strokeLinejoin="round" fill="none" />
          <ellipse cx="28" cy="56" rx="9" ry="7" transform="rotate(-18 28 56)" />
          <ellipse cx="54" cy="50" rx="9" ry="7" transform="rotate(-18 54 50)" />
        </g>
      )}
      {kind === 'activities' && (
        <path fill={fg} d="M22 30h14a7 7 0 1 1 12 0h14v14a7 7 0 1 1 0 12v14H48a7 7 0 1 0-12 0H22V56a7 7 0 1 0 0-12Z" />
      )}
      {kind === 'progress' && (
        <g fill={fg}>
          <rect x="20" y="44" width="13" height="22" rx="4" />
          <rect x="37" y="30" width="13" height="36" rx="4" opacity=".85" />
          <rect x="54" y="18" width="13" height="48" rx="4" opacity=".7" />
        </g>
      )}
    </svg>
  );
}

export function SheetArt({ scanning = false }) {
  return (
    <div className={`sheet-art ${scanning ? 'is-scanning' : ''}`} aria-hidden="true">
      <div className="sheet-art__paper">
        <span className="sheet-art__title" />
        {[70, 90, 60, 84, 50, 76].map((w, i) => (
          <span key={i} className="sheet-art__line" style={{ width: `${w}%` }} />
        ))}
        <span className="sheet-art__stamp" />
      </div>
      <i className="sheet-art__beam" />
    </div>
  );
}
