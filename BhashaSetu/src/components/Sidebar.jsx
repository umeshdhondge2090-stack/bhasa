import { NAV } from '../data/content';
import { NavIcon } from './icons';
import Logo from './Logo';
import OfflineStatus from './OfflineStatus';

const isActive = (path, key) => (key === '/' ? path === '/' : path.startsWith(key));

export function Sidebar({ path, navigate }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <Logo />
      <nav className="sidebar__nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${isActive(path, n.key) ? 'is-active' : ''}`}
            onClick={() => navigate(n.key)}
            aria-current={isActive(path, n.key) ? 'page' : undefined}
            title={n.label}
          >
            <NavIcon name={n.icon} />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar__foot">
        <OfflineStatus variant="pill" />
      </div>
    </aside>
  );
}
