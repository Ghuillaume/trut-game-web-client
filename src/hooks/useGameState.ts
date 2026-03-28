import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import type { PlayerView } from '../types/game';

export function useGameState() {
  const gameView = useGameStore((s) => s.gameView);
  const playerId = useGameStore((s) => s.playerId);

  const isMyTurn = useMemo(
    () => gameView?.currentPlayerId === playerId,
    [gameView?.currentPlayerId, playerId]
  );

  const myPlayer = useMemo(
    () => gameView?.players.find((p) => p.id === playerId) ?? null,
    [gameView?.players, playerId]
  );

  const teammates = useMemo(
    () =>
      gameView?.players.filter(
        (p) => p.team === myPlayer?.team && p.id !== playerId
      ) ?? [],
    [gameView?.players, myPlayer?.team, playerId]
  );

  const opponents = useMemo(
    () =>
      gameView?.players.filter((p) => p.team !== myPlayer?.team) ?? [],
    [gameView?.players, myPlayer?.team]
  );

  const sortedPlayers = useMemo((): PlayerView[] => {
    if (!gameView?.players || !playerId) return [];
    const players = gameView.players;
    const myIdx = players.findIndex((p) => p.id === playerId);
    if (myIdx < 0) return players;
    // Rotate so current player is first (bottom of table)
    return [...players.slice(myIdx), ...players.slice(0, myIdx)];
  }, [gameView?.players, playerId]);

  const canPlayCard = useMemo(
    () => gameView?.availableActions.some((a) => a.startsWith('PLAY_CARD')) ?? false,
    [gameView?.availableActions]
  );

  const canTrut = useMemo(
    () => gameView?.availableActions.includes('TRUT') ?? false,
    [gameView?.availableActions]
  );

  const canCall = useMemo(
    () => gameView?.availableActions.includes('CALL') ?? false,
    [gameView?.availableActions]
  );

  const canFold = useMemo(
    () => gameView?.availableActions.includes('FOLD') ?? false,
    [gameView?.availableActions]
  );

  const canBrellan = useMemo(
    () => gameView?.availableActions.includes('BRELLAN') ?? false,
    [gameView?.availableActions]
  );

  const canDeuxPareilles = useMemo(
    () => gameView?.availableActions.includes('DEUX_PAREILLES') ?? false,
    [gameView?.availableActions]
  );

  return {
    gameView,
    isMyTurn,
    myPlayer,
    teammates,
    opponents,
    sortedPlayers,
    canPlayCard,
    canTrut,
    canCall,
    canFold,
    canBrellan,
    canDeuxPareilles,
  };
}
