import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProfilePseudo } from '../../hooks/useProfilePseudo';
import './CreateGameForm.css';

interface CreateGameFormProps {
  onSubmit: (pseudo: string) => void;
  loading?: boolean;
}

export function CreateGameForm({ onSubmit, loading }: CreateGameFormProps) {
  const user = useAuthStore((s) => s.user);
  const savedPseudo = useProfilePseudo(user?.uid ?? null);
  const [pseudo, setPseudo] = useState('');

  const isLoggedIn = !!user;
  // Auto-fill once saved pseudo is loaded; locked when logged in
  const effectivePseudo = isLoggedIn ? (savedPseudo || '') : (pseudo || savedPseudo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectivePseudo.trim()) onSubmit(effectivePseudo.trim());
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
          value={effectivePseudo}
          onChange={isLoggedIn ? undefined : (e) => setPseudo(e.target.value)}
          readOnly={isLoggedIn}
          maxLength={20}
          required
          data-testid="pseudo-input"
          className={isLoggedIn ? 'input-readonly' : undefined}
        />
      </div>
      <button type="submit" disabled={!effectivePseudo.trim() || loading} data-testid="create-btn">
        {loading ? 'Création…' : '✦ Ouvrir la Table'}
      </button>
    </form>
  );
}
