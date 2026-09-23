import { LuCheck } from 'react-icons/lu';

/**
 * <ProgressIndicator variant="steps" steps={[{label}]} current={1} />
 * <ProgressIndicator variant="ring" value={72} label="Class average" />
 * <ProgressIndicator variant="bar" value={40} />
 */
export default function ProgressIndicator({ variant = 'bar', steps = [], current = 0, value = 0, label, size = 120, tone = 'light', compact = false }) {
  if (variant === 'steps') {
    return (
      <ol className={`stepper stepper--${tone} ${compact ? 'is-compact' : ''}`} aria-label="Progress">
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'active' : 'todo';
          return (
            <li key={s.label} className={`stepper__item is-${state}`} aria-current={state === 'active' ? 'step' : undefined}>
              <span className="stepper__dot">{state === 'done' ? <LuCheck size={16} strokeWidth={3} /> : s.icon || i + 1}</span>
              <span className="stepper__label">{s.label}</span>
            </li>
          );
        })}
      </ol>
    );
  }
  if (variant === 'ring') {
    const r = size / 2 - 10;
    const c = 2 * Math.PI * r;
    return (
      <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${label || 'Progress'} ${value}%`}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E1EEFB" strokeWidth="10" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.3,.7,.2,1)' }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00AEEF" />
              <stop offset="1" stopColor="#0069D9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="ring__label">
          <strong>{value}%</strong>
          {label && <span>{label}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
