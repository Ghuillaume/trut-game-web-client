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
      {/* Hero Section */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          <span>Le Jeu de</span> <em>Truts</em>
        </h1>
        <p className="home-hero-subtitle">
          Le Trut est un jeu de plis français du XVII<sup>e</sup> siècle où le courage vaut plus que les cartes.
          Maîtrisez l'art du bluff.
        </p>
        <div className="home-hero-image">
          <img src="/hero-cards.jpg" alt="Cartes anciennes et verre de vin" />
        </div>
      </section>

      {error && <div className="home-error" data-testid="home-error">{error}</div>}

      {/* Forms Section */}
      <section className="home-forms">
        <CreateGameForm onSubmit={handleCreate} loading={loading} />
        <JoinGameForm
          onSubmit={handleJoin}
          initialGameId={gameIdFromUrl ?? ''}
          loading={loading}
        />
      </section>

      {/* Codex Section */}
      <section className="home-codex">
        <span className="home-codex-label">Le Codex</span>
        <h2 className="home-codex-title">Les Trois Piliers du Trut</h2>
        <p className="home-codex-text">
          Avant d'entrer dans le salon, rappelez-vous que le Trut se gagne dans l'esprit,
          pas dans les mains. Apprenez la hiérarchie des cartes (le 7 étant le plus fort)
          lancez votre «&nbsp;Trut&nbsp;» au bon moment !.
        </p>
      </section>
    </div>
  );
}
