import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LobbyPage } from './pages/LobbyPage';
import { GamePage } from './pages/GamePage';
import { RulesPage } from './pages/RulesPage';
import { BottomNav } from './components/shared/BottomNav';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname === '/' || location.pathname === '/rules';

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/lobby/:gameId" element={<LobbyPage />} />
        <Route path="/game/:gameId" element={<ErrorBoundary><GamePage /></ErrorBoundary>} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
