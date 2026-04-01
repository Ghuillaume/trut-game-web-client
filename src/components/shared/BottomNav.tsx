import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { label: 'Jouer', icon: '♠', to: '/' },
  { label: 'Règles', icon: '📜', to: '/rules' },
  { label: 'Lobby', icon: '🏠', to: '/' },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map(({ label, icon, to }) => {
          const isActive =
            (label === 'Jouer' && pathname === '/' ) ||
            (label === 'Règles' && pathname === '/rules') ||
            (label === 'Lobby' && pathname === '/');
          const activeClass = (label === 'Jouer' && pathname === '/') || (label === 'Règles' && pathname === '/rules')
            ? ' bottom-nav-tab--active'
            : '';

          return (
            <Link
              key={label}
              to={to}
              className={`bottom-nav-tab${activeClass}`}
              data-testid={`nav-${label.toLowerCase().replace('è', 'e')}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="bottom-nav-icon">{icon}</span>
              <span className="bottom-nav-label">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
