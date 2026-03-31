import type { CompletedTrickView, PlayerView, TrutChallengeView } from '../../types/game';
import { teamPlayerNames } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './RoundRecap.css';

interface RoundRecapProps {
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  trutChallenge?: TrutChallengeView | null;
  onNextRound: () => void;
}

export function RoundRecap({ completedTricks, players, trutChallenge, onNextRound }: RoundRecapProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  const trickWins: Record<string, number> = {};
  completedTricks.forEach((t) => {
    if (t.winnerTeam) trickWins[t.winnerTeam] = (trickWins[t.winnerTeam] ?? 0) + 1;
  });
  const roundWinnerTeam = Object.entries(trickWins).find(([, wins]) => wins >= 2)?.[0];
  const roundType = trutChallenge ? 'Trut' : 'Pigeon';

  return (
    <div className="round-recap" data-testid="round-recap">
      {roundWinnerTeam ? (
        <div className="recap-result" data-testid="recap-result">
          <strong>{teamPlayerNames(players, roundWinnerTeam)}</strong> remportent un <em>{roundType}</em> !
        </div>
      ) : (
        completedTricks.length > 0 && (
          <div className="recap-result" data-testid="recap-result">
            Manche nulle — tous les plis sont pourris !
          </div>
        )
      )}
      <h3>📋 Récapitulatif de la manche</h3>
      <div className="recap-tricks">
        {completedTricks.map((trick, i) => (
          <div key={i} className="recap-trick">
            <div className="recap-trick-header">
              <span className="recap-trick-num">Pli {i + 1}</span>
              {trick.winnerTeam ? (
                <span className="recap-trick-winner">→ {teamPlayerNames(players, trick.winnerTeam!)}</span>
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
