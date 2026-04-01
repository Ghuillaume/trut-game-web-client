import type { PlayerView } from '../../types/game';
import { teamPlayerNames } from '../../types/game';
import './GameOverPanel.css';

interface GameOverPanelProps {
  winner: string | null;
  myTeam: string;
  players: PlayerView[];
  rematchVotes: string[];
  playerId: string;
  onRematch: () => void;
  onQuit: () => void;
}

export function GameOverPanel({
  winner,
  players,
  rematchVotes,
  playerId,
  onRematch,
  onQuit,
}: GameOverPanelProps) {
  const hasVotedRematch = rematchVotes.includes(playerId);
  const humanCount = players.filter(p => !p.isAi).length;

  return (
    <div className="game-over-panel" data-testid="game-over">
      <h2>🏆 Partie terminée !</h2>
      <p>
        Vainqueur : <strong>{winner ? teamPlayerNames(players, winner) : '?'}</strong>
      </p>
      <div className="game-over-actions">
        <button
          className="action-btn action-rematch"
          onClick={onRematch}
          disabled={hasVotedRematch}
          data-testid="rematch-btn"
        >
          {hasVotedRematch ? '✅ Vote enregistré' : '🔄 Nouvelle partie'}
        </button>
        <button onClick={onQuit} data-testid="new-game-btn">
          🏠 Quitter
        </button>
      </div>
      {rematchVotes.length > 0 && (
        <p className="rematch-status" data-testid="rematch-status">
          Revanche : {rematchVotes.length}/{humanCount} votes
          {rematchVotes.length > 0 && (
            <span className="rematch-voters">
              {' '}({rematchVotes.map(vid =>
                players.find(p => p.id === vid)?.pseudo ?? '?'
              ).join(', ')})
            </span>
          )}
        </p>
      )}
    </div>
  );
}
