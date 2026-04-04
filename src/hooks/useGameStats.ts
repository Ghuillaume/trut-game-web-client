import { useEffect, useRef } from 'react';
import type { GameView } from '../types/game';
import { useAuthStore } from '../store/authStore';
import { recordGameResult } from '../lib/statsService';

interface TrutAccumulator {
  trutsWon: number;
  trutsLost: number;
  trutsCalled: number;
  trutsFolded: number;
}

/**
 * Tracks game statistics and records them to Firestore when the game ends.
 * Only tracks games where all players are human (no AI).
 */
export function useGameStats(gameView: GameView | null, playerId: string | null): void {
  const user = useAuthStore((s) => s.user);

  const statsSavedRef = useRef(false);
  const trutAccRef = useRef<TrutAccumulator>({ trutsWon: 0, trutsLost: 0, trutsCalled: 0, trutsFolded: 0 });
  const prevChallengeRef = useRef(gameView?.trutChallenge ?? null);
  const prevFoldedRef = useRef<string[]>([]);

  // Accumulate trut stats as challenge state changes
  useEffect(() => {
    if (!playerId || !gameView?.trutChallenge) {
      prevChallengeRef.current = null;
      prevFoldedRef.current = [];
      return;
    }

    const challenge = gameView.trutChallenge;
    const prev = prevChallengeRef.current;

    // New challenge appeared
    if (!prev && challenge) {
      prevFoldedRef.current = [];
    }

    // Detect when my id is newly added to foldedPlayerIds
    const currentFolded = challenge.foldedPlayerIds ?? [];
    const prevFolded = prevFoldedRef.current;
    if (currentFolded.includes(playerId) && !prevFolded.includes(playerId)) {
      trutAccRef.current.trutsFolded += 1;
    }
    prevFoldedRef.current = currentFolded;

    // Detect DECLINED: challenger won (opponents all folded)
    if (prev?.status !== 'DECLINED' && challenge.status === 'DECLINED') {
      if (challenge.challengerId === playerId) {
        trutAccRef.current.trutsWon += 1;
      }
    }

    // Detect ACCEPTED: someone called
    if (prev?.status !== 'ACCEPTED' && challenge.status === 'ACCEPTED') {
      if (challenge.calledPlayerId === playerId) {
        trutAccRef.current.trutsCalled += 1;
      }
    }

    prevChallengeRef.current = challenge;
  }, [gameView?.trutChallenge, playerId]);

  // Record stats when game is over
  useEffect(() => {
    if (!gameView || gameView.phase !== 'GAME_OVER') return;
    if (!user || !playerId) return;
    if (statsSavedRef.current) return;

    const hasAi = gameView.players.some((p) => p.isAi);
    if (hasAi) return;

    statsSavedRef.current = true;

    const myPlayer = gameView.players.find((p) => p.id === playerId);
    if (!myPlayer) return;

    const myTeam = myPlayer.team;
    const won = gameView.winner === myTeam;

    const teammates = gameView.players
      .filter((p) => p.team === myTeam && p.id !== playerId)
      .map((p) => p.pseudo);

    const opponents = gameView.players
      .filter((p) => p.team !== myTeam)
      .map((p) => p.pseudo);

    recordGameResult(user.uid, {
      won,
      teammates,
      opponents,
      trutsWon: trutAccRef.current.trutsWon,
      trutsLost: trutAccRef.current.trutsLost,
      trutsCalled: trutAccRef.current.trutsCalled,
      trutsFolded: trutAccRef.current.trutsFolded,
    }).catch(console.error);
  }, [gameView?.phase, user, playerId]);
}
