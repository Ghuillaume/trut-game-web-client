import type { PlayerView } from '../../types/game';
import './PlayerList.css';

interface PlayerListProps {
  players: PlayerView[];
  currentPlayerId?: string | null;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="player-list" data-testid="player-list">
      <h3>Joueurs ({players.length}/4)</h3>
      <ul>
        {players.map((p) => (
          <li
            key={p.id}
            className={`player-item ${p.id === currentPlayerId ? 'player-me' : ''} ${p.connected === false ? 'player-disconnected' : ''}`}
          >
            <span className={`player-team-dot team-${p.team?.toLowerCase()}`} />
            <span className="player-pseudo">
              {p.isAi && '🤖 '}{p.pseudo}
            </span>
            {p.id === currentPlayerId && <span className="player-badge">Moi</span>}
            {p.isAi && <span className="player-badge player-badge-ai">IA</span>}
            {p.connected === false && <span className="player-badge player-badge-dc">Déconnecté</span>}
          </li>
        ))}
      </ul>
      {players.length < 4 && (
        <p className="player-waiting">En attente de {4 - players.length} joueur(s)…</p>
      )}
    </div>
  );
}
