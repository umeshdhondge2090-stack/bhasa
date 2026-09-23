import { useState } from 'react';
import { LuEllipsis } from 'react-icons/lu';
import { NAV } from '../data/content';
import { NavIcon } from './icons';

const isActive = (path, key) => (key === '/' ? path === '/' : path.startsWith(key));

export function BottomNav({ path, navigate }) {
  const [more, setMore] = useState(false);
  const main = NAV.slice(0, 4);
  const extra = NAV.slice(4);
  const moreActive = extra.some((n) => isActive(path, n.key));
  const go = (k) => {
    setMore(false);
    navigate(k);
  };
  return (
    <>
      {more && (
        <div className="bottom-sheet" role="menu">
          {extra.map((n) => (
            <button key={n.key} className={`nav-item ${isActive(path, n.key) ? 'is-active' : ''}`} onClick={() => go(n.key)} role="menuitem">
              <NavIcon name={n.icon} />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      )}
      <nav className="bottom-nav" aria-label="Main navigation">
        {main.map((n) => (
          <button key={n.key} className={`bn-item ${isActive(path, n.key) ? 'is-active' : ''}`} onClick={() => go(n.key)} aria-current={isActive(path, n.key) ? 'page' : undefined}>
            <NavIcon name={n.icon} size={22} />
            <span>{n.label}</span>
          </button>
        ))}
        <button className={`bn-item ${moreActive || more ? 'is-active' : ''}`} onClick={() => setMore((m) => !m)} aria-expanded={more}>
          <LuEllipsis size={22} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
