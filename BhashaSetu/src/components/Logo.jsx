export default function Logo({ compact = false }) {
  return (
    <a href="#/" className="logo" aria-label="Johar home">
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 26C24 24 21 16 24 8c8 1 12 8 8 18Z" fill="#16A36A" />
        <path d="M32 26c8-2 11-10 8-18-8 1-12 8-8 18Z" fill="#00AEEF" />
        <path d="M6 30c10-4 18-2 26 4 8-6 16-8 26-4v24c-10-4-18-2-26 4-8-6-16-8-26-4Z" fill="#0069D9" />
        <path d="M32 34v24" stroke="#fff" strokeWidth="2.4" />
        <path d="M12 38c6-1 11 0 16 3M12 45c6-1 11 0 16 3M52 38c-6-1-11 0-16 3M52 45c-6-1-11 0-16 3" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      {!compact && (
        <span className="logo__text">
          <span className="logo__name">
            Johar
          </span>
          <span className="logo__tag">Every Child. Every Language.</span>
        </span>
      )}
    </a>
  );
}
