import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateGameForm } from '../components/lobby/CreateGameForm';
import { JoinGameForm } from '../components/lobby/JoinGameForm';
import { useGameStore } from '../store/gameStore';
import { createGame, joinGame } from '../api/gameApi';
import './HomePage.css';

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPseudo = useGameStore((s) => s.setPseudo);
  const setPlayerId = useGameStore((s) => s.setPlayerId);
  const setGameId = useGameStore((s) => s.setGameId);

  const gameIdFromUrl = searchParams.get('join');

  const handleCreate = async (pseudo: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createGame(pseudo);
      setPseudo(pseudo);
      setPlayerId(result.playerId);
      setGameId(result.gameId);
      navigate(`/lobby/${result.gameId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (gameId: string, pseudo: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await joinGame(gameId, pseudo);
      setPseudo(pseudo);
      setPlayerId(result.playerId);
      setGameId(gameId);
      navigate(`/lobby/${gameId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page" data-testid="home-page">
      <header className="home-header">
        <h1>🃏 Trut Online</h1>
        <p>Le jeu de cartes traditionnel de l'ouest de la France</p>
      </header>

      {error && <div className="home-error" data-testid="home-error">{error}</div>}

      <div className="home-forms">
        <CreateGameForm onSubmit={handleCreate} loading={loading} />
        <div className="home-divider">ou</div>
        <JoinGameForm
          onSubmit={handleJoin}
          initialGameId={gameIdFromUrl ?? ''}
          loading={loading}
        />
      </div>
    </div>
  );
}
