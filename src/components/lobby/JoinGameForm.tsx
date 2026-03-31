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
      <h2>👥 Rejoindre une partie</h2>
      <div className="form-field">
        <label htmlFor="join-pseudo">Votre pseudo</label>
        <input
          id="join-pseudo"
          type="text"
          placeholder="ex. Le Corsaire"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={20}
          required
          data-testid="join-pseudo-input"
        />
      </div>
      <div className="form-field">
        <label htmlFor="join-gameid">Code de la partie</label>
        <input
          id="join-gameid"
          type="text"
          placeholder="Entrez le code"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          required
          data-testid="gameid-input"
        />
      </div>
      <button
        type="submit"
        disabled={!gameId.trim() || !pseudo.trim() || loading}
        data-testid="join-btn"
      >
        {loading ? 'Connexion…' : '🚪 Entrer au Salon'}
      </button>
    </form>
  );
}
