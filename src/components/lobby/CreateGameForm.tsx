import { useState } from 'react';
import './CreateGameForm.css';

interface CreateGameFormProps {
  onSubmit: (pseudo: string) => void;
  loading?: boolean;
}

export function CreateGameForm({ onSubmit, loading }: CreateGameFormProps) {
  const [pseudo, setPseudo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudo.trim()) onSubmit(pseudo.trim());
  };

  return (
    <form className="create-game-form" onSubmit={handleSubmit} data-testid="create-game-form">
      <h2>Créer une partie</h2>
      <input
        type="text"
        placeholder="Votre pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        maxLength={20}
        required
        data-testid="pseudo-input"
      />
      <button type="submit" disabled={!pseudo.trim() || loading} data-testid="create-btn">
        {loading ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
}
