import type { CompletedTrickView, PlayerView, TrutChallengeView } from '../../types/game';
import { teamPlayerNames } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './RoundRecap.css';

interface RoundRecapProps {
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  trutChallenge?: TrutChallengeView | null;
  onNextRound: () => void;
  /** Remaining hands for all players when round ended before trick 3 */
  revealedHands?: Record<string, string[]>;
  /** The current player's own remaining hand */
  myHand?: string[];
  /** The current player's id */
  myPlayerId?: string;
  /** Whether to show the "next round" button (false when round decided early on client) */
  showNextRoundButton?: boolean;
}

export function RoundRecap({
  completedTricks,
  players,
  trutChallenge,
  onNextRound,
  revealedHands,
  myHand,
  myPlayerId,
  showNextRoundButton = true,
}: RoundRecapProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  const trickWins: Record<string, number> = {};
  completedTricks.forEach((t) => {
    if (t.winnerTeam) trickWins[t.winnerTeam] = (trickWins[t.winnerTeam] ?? 0) + 1;
  });
  const roundWinnerTeam = Object.entries(trickWins).find(([, wins]) => wins >= 2)?.[0];
  const roundType = trutChallenge ? 'Trut' : 'Pigeon';

  // Build remaining hands: prefer server-revealed hands, fall back to myHand for current player
  const remainingHands: Record<string, string[]> = { ...(revealedHands ?? {}) };
  if (myPlayerId && myHand && myHand.length > 0 && !remainingHands[myPlayerId]) {
    remainingHands[myPlayerId] = myHand;
  }
  const hasRemainingCards = completedTricks.length < 3 && Object.keys(remainingHands).length > 0;

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

      {hasRemainingCards && (
        <div className="recap-remaining" data-testid="recap-remaining">
          <div className="recap-remaining-title">🃏 Cartes non jouées</div>
          <div className="recap-trick-cards">
            {players.map((p) => {
              const cards = remainingHands[p.id];
              if (!cards || cards.length === 0) return null;
              return (
                <div key={p.id} className="recap-remaining-player">
                  <div className="recap-remaining-cards">
                    {cards.map((cardId, i) => (
                      <CardComponent key={i} cardId={cardId} small />
                    ))}
                  </div>
                  <span className="recap-player-name">{p.pseudo}</span>
                </div>
              );
            })}
            {/* Face-down cards for players whose hands are not revealed */}
            {players
              .filter((p) => !remainingHands[p.id] && p.cardCount > 0)
              .map((p) => (
                <div key={p.id} className="recap-remaining-player">
                  <div className="recap-remaining-cards">
                    {Array.from({ length: p.cardCount }, (_, i) => (
                      <CardComponent key={i} faceDown small />
                    ))}
                  </div>
                  <span className="recap-player-name">{p.pseudo}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {showNextRoundButton && (
        <button className="action-btn action-next-round" onClick={onNextRound} data-testid="next-round-btn">
          Manche suivante ▶
        </button>
      )}
    </div>
  );
}
