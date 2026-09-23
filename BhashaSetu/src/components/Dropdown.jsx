import { useEffect, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

/** Accessible select-like menu. Closes on outside click / Escape. */
export default function Dropdown({ icon, label, items, onSelect, value, align = 'left', className = '', minWidth }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div className={`dd ${className}`} ref={ref}>
      <button className="dd__btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        {icon}
        <span>{label}</span>
        <LuChevronDown size={16} className={`dd__chev ${open ? 'is-open' : ''}`} />
      </button>
      {open && (
        <ul className={`dd__menu dd__menu--${align}`} role="listbox" style={{ minWidth }}>
          {items.map((it) => (
            <li key={it.value ?? it.label}>
              <button
                role="option"
                aria-selected={it.value === value}
                className={it.value === value ? 'is-selected' : ''}
                onClick={() => {
                  onSelect?.(it.value ?? it.label);
                  setOpen(false);
                }}
              >
                {it.icon}
                {it.label}
                {it.hint && <small>{it.hint}</small>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
