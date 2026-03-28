import type { CompletedTrickView, PlayerView } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './RoundRecap.css';

interface RoundRecapProps {
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  onNextRound: () => void;
}

export function RoundRecap({ completedTricks, players, onNextRound }: RoundRecapProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  return (
    <div className="round-recap" data-testid="round-recap">
      <h3>📋 Récapitulatif de la manche</h3>
      <div className="recap-tricks">
        {completedTricks.map((trick, i) => (
          <div key={i} className="recap-trick">
            <div className="recap-trick-header">
              <span className="recap-trick-num">Pli {i + 1}</span>
              {trick.winnerTeam ? (
                <span className="recap-trick-winner">→ {trick.winnerTeam}</span>
              ) : (
                <span className="recap-trick-pourri">💀 Pourri</span>
              )}
            </div>
            <div className="recap-trick-cards">
              {trick.entries.map((entry, j) => (
                <div key={j} className="recap-trick-entry">
                  <CardComponent cardId={entry.card} small />
                  <span className="recap-player-name">{getPlayerPseudo(entry.playerId)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="action-btn action-next-round" onClick={onNextRound} data-testid="next-round-btn">
        Manche suivante ▶
      </button>
    </div>
  );
}
