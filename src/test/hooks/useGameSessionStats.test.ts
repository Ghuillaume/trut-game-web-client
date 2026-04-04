import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameSessionStats } from '../../hooks/useGameSessionStats';
import * as gameStatsService from '../../lib/gameStatsService';
import type { GameView } from '../../types/game';

const makeView = (phase: string, withAi = false): GameView => ({
  gameId: 'game-1',
  phase,
  team: 'TEAM_A',
  currentPlayerId: 'p1',
  trutChallenge: null,
  players: [
    { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', isAi: false },
    { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', isAi: false },
    { id: 'p3', pseudo: 'Charlie', team: 'TEAM_A', isAi: withAi },
    { id: 'p4', pseudo: 'AI-Diana', team: 'TEAM_B', isAi: true },
  ],
  hand: [],
  completedTricks: [],
  currentTrick: [],
  score: { TEAM_A: { tokens: 0 }, TEAM_B: { tokens: 0 } },
  roundNumber: 1,
  fortialActive: false,
  winner: null,
  allHands: [],
  rematchVotes: [],
  currentDealerId: 'p1',
});

describe('useGameSessionStats', () => {
  beforeEach(() => {
    vi.mocked(gameStatsService.recordGameStart).mockClear();
    vi.mocked(gameStatsService.recordGameDuration).mockClear();
  });

  it('should record game start when phase becomes PLAYING_TRICK', () => {
    const view = makeView('PLAYING_TRICK', false);
    renderHook(() => useGameSessionStats('game-1', view, 'p1'));

    expect(gameStatsService.recordGameStart).toHaveBeenCalledWith(
      'game-1',
      'Alice',
      1, // one AI (p4)
    );
  });

  it('should count bot players correctly', () => {
    const view = makeView('PLAYING_TRICK', true); // p3 and p4 are AI
    renderHook(() => useGameSessionStats('game-1', view, 'p1'));

    expect(gameStatsService.recordGameStart).toHaveBeenCalledWith('game-1', 'Alice', 2);
  });

  it('should not record start when phase is WAITING_FOR_PLAYERS', () => {
    const view = makeView('WAITING_FOR_PLAYERS');
    renderHook(() => useGameSessionStats('game-1', view, 'p1'));

    expect(gameStatsService.recordGameStart).not.toHaveBeenCalled();
  });

  it('should not record if gameId or playerId is null', () => {
    const view = makeView('PLAYING_TRICK');
    renderHook(() => useGameSessionStats(null, view, 'p1'));
    renderHook(() => useGameSessionStats('game-1', view, null));

    expect(gameStatsService.recordGameStart).not.toHaveBeenCalled();
  });

  it('should record duration on GAME_OVER after having started', () => {
    const { rerender } = renderHook(
      ({ phase }: { phase: string }) =>
        useGameSessionStats('game-1', makeView(phase), 'p1'),
      { initialProps: { phase: 'PLAYING_TRICK' } },
    );

    rerender({ phase: 'GAME_OVER' });

    expect(gameStatsService.recordGameStart).toHaveBeenCalledTimes(1);
    expect(gameStatsService.recordGameDuration).toHaveBeenCalledWith(
      'game-1',
      expect.any(Date),
    );
  });

  it('should not record duration if game never entered active phase', () => {
    const { rerender } = renderHook(
      ({ phase }: { phase: string }) =>
        useGameSessionStats('game-1', makeView(phase), 'p1'),
      { initialProps: { phase: 'WAITING_FOR_PLAYERS' } },
    );

    rerender({ phase: 'GAME_OVER' });

    expect(gameStatsService.recordGameDuration).not.toHaveBeenCalled();
  });

  it('should not record start twice on re-render', () => {
    const view = makeView('PLAYING_TRICK');
    const { rerender } = renderHook(() => useGameSessionStats('game-1', view, 'p1'));
    rerender();
    rerender();

    expect(gameStatsService.recordGameStart).toHaveBeenCalledTimes(1);
  });
});
