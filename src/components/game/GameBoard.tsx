import { useState, useEffect, useRef } from 'react';
import type { TrickEntryView, CompletedTrickView, PlayerView } from '../../types/game';
import { teamPlayerNames } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './GameBoard.css';

interface GameBoardProps {
  currentTrick: TrickEntryView[];
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  playerCount: number;
}

export function GameBoard({ currentTrick, completedTricks, players }: GameBoardProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  // Delay clearing the trick for 2 seconds when a trick completes.
  // The backend evaluates completed tricks atomically (trick goes from N entries → 0),
  // so we detect completion by watching completedTricks.length increase.
  const [displayedTrick, setDisplayedTrick] = useState<TrickEntryView[]>(currentTrick);
  const prevCompletedCountRef = useRef(completedTricks.length);

  useEffect(() => {
    const prevCount = prevCompletedCountRef.current;
    prevCompletedCountRef.current = completedTricks.length;

    // A new trick was completed — show its cards for 2 seconds before clearing
    if (completedTricks.length > prevCount && completedTricks.length > 0) {
      const lastCompleted = completedTricks[completedTricks.length - 1];
      if (lastCompleted) {
        setDisplayedTrick(lastCompleted.entries);
      }
      const timer = setTimeout(() => {
        setDisplayedTrick(currentTrick);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setDisplayedTrick(currentTrick);
    }
  }, [currentTrick, completedTricks]);

  // Last completed trick for quick reference
  const lastCompletedTrick = completedTricks && completedTricks.length > 0
    ? completedTricks[completedTricks.length - 1]
    : null;

  return (
    <div className="game-board" data-testid="game-board">
      {/* Current trick area */}
      <div className="trick-area">
        {displayedTrick.length === 0 ? (
          <span className="board-empty">Aucune carte jouée</span>
        ) : (
          <div className="trick-cards">
            {displayedTrick.map((entry, i) => (
              <div key={i} className="trick-entry">
                <CardComponent cardId={entry.card} small />
                <span className="trick-player">{getPlayerPseudo(entry.playerId)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last completed trick result */}
      {lastCompletedTrick && currentTrick.length === 0 && (
        <div className="last-trick-result" data-testid="last-trick-result">
          <div className="last-trick-cards">
            {lastCompletedTrick.entries.map((entry, i) => (
              <CardComponent key={i} cardId={entry.card} small />
            ))}
          </div>
          {lastCompletedTrick.winnerTeam ? (
            <span className="last-trick-winner">
              Pli remporté par {teamPlayerNames(players, lastCompletedTrick.winnerTeam)}
            </span>
          ) : (
            <span className="last-trick-pourri" data-testid="pourri-label">💀 Pourri !</span>
          )}
        </div>
      )}
    </div>
  );
}

