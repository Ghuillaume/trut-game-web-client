import { useState, useEffect, useRef } from 'react';
import type { TrickEntryView, CompletedTrickView, PlayerView } from '../../types/game';
import { CardComponent } from '../shared/CardComponent';
import './GameBoard.css';

interface GameBoardProps {
  currentTrick: TrickEntryView[];
  completedTricks: CompletedTrickView[];
  players: PlayerView[];
  playerCount: number;
  playerPositionMap: Record<string, string>;
}


export function GameBoard({ currentTrick, completedTricks, players, playerPositionMap }: GameBoardProps) {
  const getPlayerPseudo = (playerId: string) =>
    players.find((p) => p.id === playerId)?.pseudo ?? '?';

  // Delay clearing the trick for 2 seconds when a trick completes.
  const [displayedTrick, setDisplayedTrick] = useState<TrickEntryView[]>(currentTrick);
  const prevCompletedCountRef = useRef(completedTricks.length);

  useEffect(() => {
    const prevCount = prevCompletedCountRef.current;
    prevCompletedCountRef.current = completedTricks.length;

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

  // Build won-trick piles per player
  const wonPiles: Record<string, number> = {};
  completedTricks.forEach((trick) => {
    if (trick.winnerId) {
      wonPiles[trick.winnerId] = (wonPiles[trick.winnerId] ?? 0) + 1;
    }
  });

  return (
    <div className="game-board" data-testid="game-board">
      {/* Play slots — each card appears in front of its player, forming a square at center */}
      {displayedTrick.map((entry) => {
        const position = playerPositionMap[entry.playerId] ?? 'bottom';
        return (
          <div
            key={entry.playerId}
            className={`play-slot slot-${position}`}
          >
            <CardComponent cardId={entry.card} />
            <span className="play-slot-name">{getPlayerPseudo(entry.playerId)}</span>
          </div>
        );
      })}

      {/* Empty state */}
      {displayedTrick.length === 0 && completedTricks.length === 0 && (
        <div className="board-empty">En attente des cartes…</div>
      )}

      {/* Won trick piles near each player */}
      {Object.entries(wonPiles).map(([playerId, count]) => {
        const position = playerPositionMap[playerId] ?? 'bottom';
        return (
          <div key={playerId} className={`won-pile pile-${position}`}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="won-pile-card" style={{ transform: `rotate(${(i - 1) * 5}deg)` }} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

