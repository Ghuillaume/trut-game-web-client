import type { PlayerView } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './OpponentZone.css';

interface OpponentZoneProps {
  player: PlayerView;
  isCurrentPlayer: boolean;
  position: 'left' | 'top' | 'right';
}

export function OpponentZone({ player, isCurrentPlayer, position }: OpponentZoneProps) {
  return (
    <div
      className={`opponent-zone opponent-${position} ${isCurrentPlayer ? 'opponent-active' : ''}`}
      data-testid={`opponent-${player.id}`}
    >
      <div className="opponent-cards">
        {Array.from({ length: player.cardCount }, (_, i) => (
          <CardComponent key={i} faceDown small />
        ))}
      </div>
      <div className="opponent-info">
        <span className={`opponent-team-dot team-${player.team?.toLowerCase()}`} />
        <span className="opponent-name">{player.pseudo}</span>
        {isCurrentPlayer && <span className="opponent-turn-indicator">🎴</span>}
      </div>
    </div>
  );
}
