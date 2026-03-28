import { useState } from 'react';
import './CreateGameForm.css';

interface JoinGameFormProps {
  onSubmit: (gameId: string, pseudo: string) => void;
  initialGameId?: string;
  loading?: boolean;
}

export function JoinGameForm({ onSubmit, initialGameId, loading }: JoinGameFormProps) {
  const [gameId, setGameId] = useState(initialGameId ?? '');
  const [pseudo, setPseudo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim() && pseudo.trim()) onSubmit(gameId.trim(), pseudo.trim());
  };

  return (
    <form className="join-game-form" onSubmit={handleSubmit} data-testid="join-game-form">
      <h2>Rejoindre une partie</h2>
      <input
        type="text"
        placeholder="Code de la partie"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        required
        data-testid="gameid-input"
      />
      <input
        type="text"
        placeholder="Votre pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        maxLength={20}
        required
        data-testid="join-pseudo-input"
      />
      <button
        type="submit"
        disabled={!gameId.trim() || !pseudo.trim() || loading}
        data-testid="join-btn"
      >
        {loading ? 'Connexion...' : 'Rejoindre'}
      </button>
    </form>
  );
}
