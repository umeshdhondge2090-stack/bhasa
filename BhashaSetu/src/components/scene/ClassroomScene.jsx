/**
 * Warm Indian primary-school classroom, drawn as SVG so it stays crisp and works fully offline.
 * The centre stays calm so the character remains the visual focus.
 */
export default function ClassroomScene({ className = '' }) {
  const band = Array.from({ length: 34 }, (_, i) => i);
  return (
    <svg className={className} viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="csWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4DE" />
          <stop offset="1" stopColor="#F6E2BE" />
        </linearGradient>
        <linearGradient id="csSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FD3FF" />
          <stop offset="1" stopColor="#DDF3FF" />
        </linearGradient>
        <linearGradient id="csBoard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2E6C6A" />
          <stop offset="1" stopColor="#245654" />
        </linearGradient>
        <linearGradient id="csWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C99A66" />
          <stop offset="1" stopColor="#A87847" />
        </linearGradient>
        <linearGradient id="csFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D5A56F" />
          <stop offset="1" stopColor="#B98653" />
        </linearGradient>
        <radialGradient id="csGlow" cx="0.2" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* wall */}
      <rect width="1000" height="560" fill="url(#csWall)" />
      <rect width="1000" height="560" fill="url(#csGlow)" />

      {/* tribal-inspired border band (Sohrai-style triangles & dots) */}
      <g transform="translate(0 388)">
        <rect width="1000" height="30" fill="#EFD7AE" />
        {band.map((i) => (
          <g key={i} transform={`translate(${i * 30} 0)`}>
            <path d="M3 27 L15 5 L27 27Z" fill={i % 3 === 0 ? '#0069D9' : i % 3 === 1 ? '#E8892B' : '#B4492F'} opacity=".55" />
            <circle cx="15" cy="18" r="2.3" fill="#FFF4DE" />
          </g>
        ))}
        <rect y="28" width="1000" height="3" fill="#C99A66" opacity=".6" />
      </g>

      {/* floor */}
      <rect y="418" width="1000" height="142" fill="url(#csFloor)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M0 ${440 + i * 24} L1000 ${440 + i * 24}`} stroke="#A87847" strokeOpacity=".35" strokeWidth="2" />
      ))}

      {/* window */}
      <g transform="translate(38 70) scale(.82)">
        <rect x="-10" y="-10" width="240" height="300" rx="10" fill="#B98A55" />
        <rect width="220" height="280" rx="4" fill="url(#csSky)" />
        <circle cx="160" cy="70" r="40" fill="#FFF3B0" opacity=".85" />
        <circle cx="160" cy="70" r="22" fill="#FFE27A" />
        <path d="M0 240 Q60 190 120 226 Q170 200 220 232 L220 280 L0 280Z" fill="#7BC38D" />
        <path d="M0 262 Q70 226 130 254 Q180 236 220 258 L220 280 L0 280Z" fill="#5EAE72" />
        {/* tree outside */}
        <rect x="82" y="168" width="10" height="64" fill="#8A5A34" />
        <circle cx="86" cy="150" r="42" fill="#3E9E62" />
        <circle cx="58" cy="172" r="28" fill="#4BAF6F" />
        <circle cx="114" cy="170" r="30" fill="#4BAF6F" />
        <rect x="-4" y="136" width="228" height="8" fill="#B98A55" />
        <rect x="106" y="-4" width="8" height="288" fill="#B98A55" />
        <rect x="-10" y="290" width="240" height="12" rx="4" fill="#A87847" />
      </g>
      {/* light shaft */}
      <path d="M230 76 L470 420 L330 420 L210 110Z" fill="#fff" opacity=".13" />

      {/* chalkboard */}
      <g transform="translate(262 52)">
        <rect x="-14" y="-14" width="500" height="326" rx="12" fill="url(#csWood)" />
        <rect width="472" height="298" rx="6" fill="url(#csBoard)" />
        <rect width="472" height="298" rx="6" fill="none" stroke="#1B3F3E" strokeWidth="3" />
        {/* chalk writing, kept to the left/right thirds so the character stays in focus */}
        <g fill="#F3F7F2" opacity=".92">
          <text x="26" y="72" fontSize="36" fontWeight="600" style={{ fontFamily: 'var(--font-hi)' }}>
            सीखें
          </text>
          <text x="26" y="122" fontSize="28" opacity=".85" style={{ fontFamily: 'var(--font-sat)' }}>
            ᱚ ᱛ ᱜ ᱝ
          </text>
        </g>
        <g stroke="#F3F7F2" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7">
          <path d="M30 168 q22 -18 44 0" />
          <path d="M30 196 L104 196" strokeDasharray="2 9" />
        </g>
        <g opacity=".9">
          <text x="336" y="66" fontSize="22" fontWeight="600" fill="#FFE6A3" style={{ fontFamily: 'var(--font-hi)' }}>
            छोटे कदम
          </text>
          <text x="336" y="98" fontSize="22" fontWeight="600" fill="#FFE6A3" style={{ fontFamily: 'var(--font-hi)' }}>
            बड़ा बदलाव
          </text>
        </g>
        <g fill="none" stroke="#9FE0C0" strokeWidth="3" strokeLinecap="round" opacity=".8">
          <circle cx="396" cy="176" r="24" />
          <path d="M384 176 q12 12 24 0" />
          <circle cx="388" cy="170" r="1.5" fill="#9FE0C0" />
          <circle cx="404" cy="170" r="1.5" fill="#9FE0C0" />
        </g>
        {/* chalk tray */}
        <rect x="-4" y="298" width="480" height="12" rx="4" fill="#B98A55" />
        <rect x="24" y="294" width="26" height="6" rx="2" fill="#fff" />
        <rect x="58" y="295" width="16" height="5" rx="2" fill="#FFB52E" />
      </g>

      {/* poster */}
      <g transform="translate(790 84) scale(.92)">
        <rect width="150" height="210" rx="6" fill="#FFFBF0" stroke="#E5D2AE" strokeWidth="3" />
        <rect x="8" y="8" width="134" height="194" rx="3" fill="none" stroke="#E8892B" strokeWidth="1.5" strokeDasharray="3 5" />
        <text x="75" y="60" fontSize="19" fontWeight="700" textAnchor="middle" fill="#082B68">Different</text>
        <text x="75" y="84" fontSize="19" fontWeight="700" textAnchor="middle" fill="#082B68">Languages</text>
        <text x="75" y="120" fontSize="17" fontWeight="600" textAnchor="middle" fill="#0069D9">Same</text>
        <text x="75" y="142" fontSize="17" fontWeight="600" textAnchor="middle" fill="#0069D9">Dreams</text>
        <path d="M75 186 C40 160 58 150 75 166 C92 150 110 160 75 186Z" fill="#E4573D" opacity=".85" />
      </g>

      {/* desk ledge with objects */}
      <rect y="470" width="1000" height="90" fill="url(#csWood)" />
      <rect y="466" width="1000" height="8" fill="#D9AD78" />

      {/* books left */}
      <g transform="translate(186 402) scale(.85)">
        <rect x="0" y="40" width="130" height="24" rx="3" fill="#0069D9" />
        <rect x="10" y="20" width="112" height="22" rx="3" fill="#E8892B" />
        <rect x="6" y="2" width="104" height="20" rx="3" fill="#16A36A" />
        <rect x="14" y="48" width="60" height="4" rx="2" fill="#fff" opacity=".6" />
      </g>
      {/* plant left */}
      <g transform="translate(34 344)">
        <path d="M14 84 L58 84 L52 128 L20 128Z" fill="#C0562F" />
        <rect x="10" y="78" width="52" height="10" rx="4" fill="#D8683D" />
        <path d="M36 80 Q10 40 18 4 Q42 30 36 80Z" fill="#3E9E62" />
        <path d="M36 80 Q60 36 56 0 Q30 34 36 80Z" fill="#4BAF6F" />
        <path d="M36 80 Q4 62 -6 34 Q26 44 36 80Z" fill="#2F8A54" />
        <path d="M36 80 Q70 60 78 30 Q46 42 36 80Z" fill="#37955D" />
      </g>
      {/* globe right */}
      <g transform="translate(704 352) scale(.85)">
        <path d="M30 118 L90 118 L78 100 L42 100Z" fill="#8A5A34" />
        <rect x="56" y="82" width="8" height="22" fill="#8A5A34" />
        <circle cx="60" cy="52" r="46" fill="#3DA5E8" />
        <path d="M32 40 q16 -16 28 -4 q8 14 -6 22 q-14 -2 -22 -18Z" fill="#7BC38D" />
        <path d="M66 62 q18 -6 24 8 q-8 16 -22 10 q-6 -10 -2 -18Z" fill="#7BC38D" />
        <path d="M22 26 A46 46 0 0 1 96 30" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />
        <path d="M16 12 Q60 -24 104 12" fill="none" stroke="#B98A55" strokeWidth="4" />
      </g>
      {/* books + pencil cup right */}
      <g transform="translate(818 380) scale(.9)">
        <rect x="0" y="52" width="128" height="22" rx="3" fill="#082B68" />
        <rect x="8" y="32" width="112" height="22" rx="3" fill="#0069D9" />
        <rect x="14" y="12" width="98" height="20" rx="3" fill="#FFB52E" />
        <g transform="translate(118 -14)">
          <rect x="0" y="22" width="34" height="46" rx="6" fill="#16A36A" />
          <rect x="6" y="0" width="5" height="28" fill="#E4573D" transform="rotate(-8 8 14)" />
          <rect x="14" y="-6" width="5" height="32" fill="#FFB52E" />
          <rect x="22" y="2" width="5" height="26" fill="#0069D9" transform="rotate(10 24 14)" />
        </g>
      </g>
    </svg>
  );
}
