import type { PlayerView } from '../../types/game';
import './TeamManager.css';

interface TeamManagerProps {
  players: PlayerView[];
  currentPlayerId: string;
  onSwap: (targetPlayerId: string) => void;
}

export function TeamManager({ players, currentPlayerId, onSwap }: TeamManagerProps) {
  const teamA = players.filter((p) => p.team === 'TEAM_A');
  const teamB = players.filter((p) => p.team === 'TEAM_B');

  return (
    <div className="team-manager" data-testid="team-manager">
      <h3>📋 Composition des équipes</h3>
      <p className="team-manager-hint">
        Cliquez sur un joueur pour changer son équipe.
      </p>
      <div className="team-columns">
        <div className="team-column team-a-col">
          <h4>🔵 Équipe A</h4>
          {teamA.map((p) => (
            <button
              key={p.id}
              className="team-player-btn"
              onClick={() => onSwap(p.id)}
              data-testid={`team-player-${p.id}`}
            >
              {p.isAi && '🤖 '}{p.pseudo}
              {p.id === currentPlayerId && ' (Moi)'}
              <span className="swap-arrow">→ B</span>
            </button>
          ))}
        </div>
        <div className="team-swap-icon">⇄</div>
        <div className="team-column team-b-col">
          <h4>🔴 Équipe B</h4>
          {teamB.map((p) => (
            <button
              key={p.id}
              className="team-player-btn"
              onClick={() => onSwap(p.id)}
              data-testid={`team-player-${p.id}`}
            >
              {p.isAi && '🤖 '}{p.pseudo}
              {p.id === currentPlayerId && ' (Moi)'}
              <span className="swap-arrow">→ A</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
