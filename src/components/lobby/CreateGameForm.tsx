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
      <h2>⊕ Créer une partie</h2>
      <div className="form-field">
        <label htmlFor="create-pseudo">Votre pseudo</label>
        <input
          id="create-pseudo"
          type="text"
          placeholder="ex. Le Chevalier"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={20}
          required
          data-testid="pseudo-input"
        />
      </div>
      <button type="submit" disabled={!pseudo.trim() || loading} data-testid="create-btn">
        {loading ? 'Création…' : '✦ Ouvrir la Table'}
      </button>
    </form>
  );
}
