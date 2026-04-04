import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signUpWithEmail } from '../lib/authService';
import { useAuthStore } from '../store/authStore';
import './AuthPage.css';

type Mode = 'login' | 'register';

export function AuthPage() {
  const navigate = useNavigate();
  const setError = useAuthStore((s) => s.setError);
  const authError = useAuthStore((s) => s.error);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError ?? authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!pseudo.trim()) {
          setLocalError('Veuillez saisir un pseudo.');
          return;
        }
        await signUpWithEmail(email.trim(), password, pseudo.trim());
      } else {
        await signInWithEmail(email.trim(), password);
      }
      navigate('/profile');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setLocalError(translateFirebaseError(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" data-testid="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === 'login' ? ' auth-tab--active' : ''}`}
            onClick={() => { setMode('login'); setLocalError(null); }}
            type="button"
          >
            Se connecter
          </button>
          <button
            className={`auth-tab${mode === 'register' ? ' auth-tab--active' : ''}`}
            onClick={() => { setMode('register'); setLocalError(null); }}
            type="button"
          >
            S'inscrire
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} data-testid="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-pseudo">Pseudo</label>
              <input
                id="auth-pseudo"
                type="text"
                placeholder="ex. Le Chevalier"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                maxLength={20}
                required
                data-testid="pseudo-input"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="email-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Mot de passe</label>
            <input
              id="auth-password"
              type="password"
              placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              data-testid="password-input"
            />
          </div>

          {error && (
            <p className="auth-error" data-testid="auth-error">{error}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
            data-testid="auth-submit"
          >
            {loading
              ? 'Chargement…'
              : mode === 'login' ? '✦ Entrer dans le salon' : '✦ Créer mon compte'}
          </button>
        </form>

        <button
          className="auth-skip"
          onClick={() => navigate('/')}
          type="button"
        >
          Continuer sans compte →
        </button>
      </div>
    </div>
  );
}

function translateFirebaseError(msg: string): string {
  if (msg.includes('email-already-in-use')) return 'Cet email est déjà utilisé.';
  if (msg.includes('invalid-email')) return 'Email invalide.';
  if (msg.includes('wrong-password') || msg.includes('invalid-credential')) return 'Email ou mot de passe incorrect.';
  if (msg.includes('user-not-found')) return 'Aucun compte trouvé pour cet email.';
  if (msg.includes('weak-password')) return 'Le mot de passe est trop faible (6 caractères minimum).';
  if (msg.includes('too-many-requests')) return 'Trop de tentatives. Réessayez plus tard.';
  return msg;
}
