import { useState, useEffect, useRef } from 'react';
import type { TrickEntryView, CompletedTrickView, PlayerView } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './GameBoard.css';

interface GameBoardProps {
  currentTrick: TrickEntryView[];
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  playerCount: number;
}

export function GameBoard({ currentTrick, completedTricks, players, playerCount }: GameBoardProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  // Delay clearing the trick for 1 second after all 4 cards are played
  const [displayedTrick, setDisplayedTrick] = useState<TrickEntryView[]>(currentTrick);
  const prevTrickRef = useRef(currentTrick);

  useEffect(() => {
    const prevTrick = prevTrickRef.current;
    prevTrickRef.current = currentTrick;

    // If previous trick was complete (4 entries) and now we have a new trick (fewer entries),
    // keep showing the old trick for 1 second
    if (prevTrick.length === playerCount && currentTrick.length < playerCount) {
      const timer = setTimeout(() => {
        setDisplayedTrick(currentTrick);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setDisplayedTrick(currentTrick);
    }
  }, [currentTrick, playerCount]);

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
              Pli remporté par {lastCompletedTrick.winnerTeam}
            </span>
          ) : (
            <span className="last-trick-pourri" data-testid="pourri-label">💀 Pourri !</span>
          )}
        </div>
      )}
    </div>
  );
}

