const PATTERN = [0.35, 0.55, 0.8, 0.6, 1, 0.7, 0.45, 0.9, 0.6, 0.4, 0.75, 1, 0.65, 0.5, 0.85, 0.55, 0.4, 0.7, 0.9, 0.5, 0.35, 0.6];

/** Animated audio bars. `active` runs the animation; otherwise bars rest as small dots. */
export default function AudioWave({ active = false, bars = 14, height = 26, className = '' }) {
  return (
    <span className={`wave ${active ? 'is-active' : ''} ${className}`} style={{ '--bar-h': `${height}px` }} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ '--i': i, '--m': PATTERN[i % PATTERN.length] }} />
      ))}
    </span>
  );
}
