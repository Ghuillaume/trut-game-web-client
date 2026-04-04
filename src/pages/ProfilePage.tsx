import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getUserProfile, getUserStats } from '../lib/statsService';
import type { UserProfile, UserStats } from '../types/auth';
import { deriveStats, DEFAULT_STATS } from '../types/auth';
import { signOut } from '../lib/authService';
import './ProfilePage.css';

const FIRESTORE_TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), FIRESTORE_TIMEOUT_MS)),
  ]);
}

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fallbackProfile: UserProfile = {
      pseudo: user.displayName ?? user.email?.split('@')[0] ?? 'Joueur',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (async () => {
      setLoading(true);
      setFirestoreError(false);
      try {
        const [p, s] = await Promise.all([
          withTimeout(getUserProfile(user.uid).catch(() => null), null),
          withTimeout(getUserStats(user.uid).catch(() => null), null),
        ]);
        const timedOut = p === null && s === null;
        if (timedOut) setFirestoreError(true);
        setProfile(p ?? fallbackProfile);
        setStats(s ?? { ...DEFAULT_STATS });
      } catch (e) {
        console.error(e);
        setFirestoreError(true);
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Chargement…</div>
      </div>
    );
  }

  if (!profile) return null;

  const derived = deriveStats(stats);

  return (
    <div className="profile-page" data-testid="profile-page">

      {firestoreError && (
        <div className="profile-firestore-warning">
          ⚠️ Les statistiques ne sont pas disponibles. Assurez-vous que Firestore est activé dans votre projet Firebase.
        </div>
      )}

      {/* ── Name ── */}
      <section className="profile-hero">
        <h1 className="profile-name">{profile.pseudo}</h1>
      </section>

      {/* ── Seasonal Mastery → Win Rate ── */}
      <section className="profile-card" data-testid="winrate-card">
        <span className="profile-card-label">Maîtrise Saisonnière</span>
        <div className="profile-mastery">
          <span className="profile-mastery-pct">{derived.winRate.toFixed(1)}%</span>
          <span className={`profile-mastery-trend ${derived.winRate >= 50 ? 'trend-up' : 'trend-down'}`}>
            {derived.winRate >= 50 ? '↗' : '↘'}
          </span>
        </div>
        <p className="profile-card-sub">
          {stats.gamesWon} victoire{stats.gamesWon !== 1 ? 's' : ''} sur {stats.gamesPlayed} partie{stats.gamesPlayed !== 1 ? 's' : ''} jouée{stats.gamesPlayed !== 1 ? 's' : ''}.
        </p>
      </section>

      {/* ── Trut Stats ── */}
      <section className="profile-card" data-testid="trut-card">
        <span className="profile-card-label">Statistiques Trut</span>
        <div className="profile-trut-grid">
          <div className="profile-trut-item">
            <span className="profile-trut-value">{stats.trutsWon}</span>
            <span className="profile-trut-key">Truts gagnés</span>
          </div>
          <div className="profile-trut-item">
            <span className="profile-trut-value">{stats.trutsLost}</span>
            <span className="profile-trut-key">Truts perdus</span>
          </div>
          <div className="profile-trut-item">
            <span className="profile-trut-value">{stats.trutsCalled}</span>
            <span className="profile-trut-key">Truts suivis</span>
          </div>
          <div className="profile-trut-item">
            <span className="profile-trut-value">{stats.trutsFolded}</span>
            <span className="profile-trut-key">Truts passés</span>
          </div>
        </div>
      </section>

      {/* ── Total Wins ── */}
      <section className="profile-card profile-card--centered" data-testid="wins-card">
        <span className="profile-card-label">Total Victoires</span>
        <div className="profile-total-wins">
          <span className="profile-wins-count">{stats.gamesWon}</span>
          <span className="profile-wins-star">⭐</span>
        </div>
        {stats.gamesLost > 0 && (
          <p className="profile-card-sub">{stats.gamesLost} défaite{stats.gamesLost !== 1 ? 's' : ''} au compteur.</p>
        )}
      </section>

      {/* ── Favourite Co-player ── */}
      <section className="profile-card" data-testid="coplayer-card">
        <span className="profile-card-label">Allié Favori</span>
        {derived.favoriteCoplayer ? (
          <>
            <p className="profile-highlight-name">{derived.favoriteCoplayer.pseudo}</p>
            <p className="profile-card-sub">
              {derived.favoriteCoplayer.gamesWon} victoire{derived.favoriteCoplayer.gamesWon !== 1 ? 's' : ''} ensemble.
            </p>
          </>
        ) : (
          <p className="profile-card-sub profile-card-empty">Jouez avec des alliés pour voir vos statistiques.</p>
        )}
      </section>

      {/* ── Enemies ── */}
      <section className="profile-card" data-testid="enemies-card">
        <span className="profile-card-label">Adversaires</span>
        <div className="profile-enemies">
          <div className="profile-enemy-item">
            <span className="profile-enemy-tag profile-enemy-tag--fav">⚔ Ennemi favori</span>
            {derived.favoriteEnemy ? (
              <>
                <p className="profile-highlight-name">{derived.favoriteEnemy.pseudo}</p>
                <p className="profile-card-sub">{derived.favoriteEnemy.gamesWon} victoire{derived.favoriteEnemy.gamesWon !== 1 ? 's' : ''} contre lui.</p>
              </>
            ) : (
              <p className="profile-card-sub profile-card-empty">Aucune donnée.</p>
            )}
          </div>
          <div className="profile-enemy-divider" />
          <div className="profile-enemy-item">
            <span className="profile-enemy-tag profile-enemy-tag--fear">💀 Ennemi redouté</span>
            {derived.mostFearedEnemy ? (
              <>
                <p className="profile-highlight-name">{derived.mostFearedEnemy.pseudo}</p>
                <p className="profile-card-sub">{derived.mostFearedEnemy.gamesLost} défaite{derived.mostFearedEnemy.gamesLost !== 1 ? 's' : ''} face à lui.</p>
              </>
            ) : (
              <p className="profile-card-sub profile-card-empty">Aucune donnée.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Chronicles of Play ── */}
      <section className="profile-chronicles" data-testid="chronicles-card">
        <div className="profile-chronicles-header">
          <span className="profile-card-label">Chroniques de Jeu</span>
        </div>
        {stats.recentGames.length === 0 ? (
          <p className="profile-card-sub profile-card-empty">Aucune partie enregistrée.</p>
        ) : (
          <ul className="profile-chronicles-list">
            {stats.recentGames.map((game, i) => (
              <li key={i} className="profile-chronicle-entry">
                <span className="profile-chronicle-date">
                  {formatDate(game.date)}
                </span>
                <div className="profile-chronicle-info">
                  <span className="profile-chronicle-opponents">
                    {game.opponents.join(' & ')}
                  </span>
                  <span className={`profile-chronicle-result profile-chronicle-result--${game.result}`}>
                    {game.result === 'win' ? '+VICTOIRE' : '−DÉFAITE'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Sign out ── */}
      <button className="profile-signout" onClick={handleSignOut} data-testid="signout-btn">
        Se déconnecter
      </button>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
