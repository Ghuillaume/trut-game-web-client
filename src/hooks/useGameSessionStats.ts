import { useEffect, useRef } from 'react';
import type { GameView } from '../types/game';
import { recordGameStart, recordGameDuration } from '../lib/gameStatsService';

const ACTIVE_PHASES = new Set(['PLAYING_TRICK', 'TRUT_CHALLENGE', 'FORTIAL_DECISION', 'END_OF_ROUND']);

/**
 * Records game-level statistics in the `gameStats` Firestore collection:
 * - On first active phase: creates an entry with pseudo, botCount, startedAt
 * - On GAME_OVER: updates the entry with durationSeconds
 *
 * Uses the gameId as the Firestore document ID (idempotent writes).
 */
export function useGameSessionStats(
  gameId: string | null,
  gameView: GameView | null,
  myPlayerId: string | null,
): void {
  const startedAtRef = useRef<Date | null>(null);
  const recordedStartRef = useRef(false);
  const recordedEndRef = useRef(false);

  useEffect(() => {
    if (!gameId || !gameView || !myPlayerId) return;

    const phase = gameView.phase;

    // Record game start once when the game transitions to an active phase
    if (ACTIVE_PHASES.has(phase) && !recordedStartRef.current) {
      recordedStartRef.current = true;
      startedAtRef.current = new Date();

      const myPlayer = gameView.players.find((p) => p.id === myPlayerId);
      const pseudo = myPlayer?.pseudo ?? 'Inconnu';
      const botCount = gameView.players.filter((p) => p.isAi).length;

      recordGameStart(gameId, pseudo, botCount).catch((err) => {
        console.warn('Could not record game start stats:', err);
      });
    }

    // Record game end once when GAME_OVER is reached
    if (phase === 'GAME_OVER' && startedAtRef.current && !recordedEndRef.current) {
      recordedEndRef.current = true;
      const startedAt = startedAtRef.current;

      recordGameDuration(gameId, startedAt).catch((err) => {
        console.warn('Could not record game duration:', err);
      });
    }
  }, [gameId, gameView?.phase, myPlayerId]);
}
