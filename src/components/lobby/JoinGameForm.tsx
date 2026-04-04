import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfilePseudo } from '../../hooks/useProfilePseudo';
import './CreateGameForm.css';

interface JoinGameFormProps {
  onSubmit: (gameId: string, pseudo: string) => void;
  initialGameId?: string;
  loading?: boolean;
}

export function JoinGameForm({ onSubmit, initialGameId, loading }: JoinGameFormProps) {
  const user = useAuthStore((s) => s.user);
  const savedPseudo = useProfilePseudo(user?.uid ?? null);
  const [gameId, setGameId] = useState(initialGameId ?? '');
  const [pseudo, setPseudo] = useState('');

  const isLoggedIn = !!user;
  const effectivePseudo = isLoggedIn ? (savedPseudo || '') : (pseudo || savedPseudo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim() && effectivePseudo.trim()) onSubmit(gameId.trim(), effectivePseudo.trim());
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
          value={effectivePseudo}
          onChange={isLoggedIn ? undefined : (e) => setPseudo(e.target.value)}
          readOnly={isLoggedIn}
          maxLength={20}
          required
          data-testid="join-pseudo-input"
          className={isLoggedIn ? 'input-readonly' : undefined}
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
        disabled={!gameId.trim() || !effectivePseudo.trim() || loading}
        data-testid="join-btn"
      >
        {loading ? 'Connexion…' : '🚪 Entrer au Salon'}
      </button>
    </form>
  );
}
