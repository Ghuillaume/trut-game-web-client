import { describe, it, expect } from 'vitest';
import { deriveStats, DEFAULT_STATS } from '../../types/auth';
import type { UserStats } from '../../types/auth';

describe('deriveStats', () => {
  it('should return 0% win rate when no games played', () => {
    const result = deriveStats(DEFAULT_STATS);
    expect(result.winRate).toBe(0);
    expect(result.favoriteCoplayer).toBeNull();
    expect(result.favoriteEnemy).toBeNull();
    expect(result.mostFearedEnemy).toBeNull();
  });

  it('should compute win rate correctly', () => {
    const stats: UserStats = {
      ...DEFAULT_STATS,
      gamesPlayed: 10,
      gamesWon: 7,
      gamesLost: 3,
    };
    expect(deriveStats(stats).winRate).toBe(70);
  });

  it('should round win rate to one decimal', () => {
    const stats: UserStats = { ...DEFAULT_STATS, gamesPlayed: 3, gamesWon: 1, gamesLost: 2 };
    expect(deriveStats(stats).winRate).toBe(33.3);
  });

  it('should pick favoriteCoplayer with highest wins', () => {
    const stats: UserStats = {
      ...DEFAULT_STATS,
      coPlayers: {
        Alice: { gamesWon: 5, gamesLost: 2 },
        Bob: { gamesWon: 3, gamesLost: 1 },
      },
    };
    expect(deriveStats(stats).favoriteCoplayer).toEqual({ pseudo: 'Alice', gamesWon: 5 });
  });

  it('should pick favoriteEnemy with most wins against', () => {
    const stats: UserStats = {
      ...DEFAULT_STATS,
      enemies: {
        Charlie: { gamesWon: 8, gamesLost: 1 },
        Dave: { gamesWon: 2, gamesLost: 5 },
      },
    };
    expect(deriveStats(stats).favoriteEnemy).toEqual({ pseudo: 'Charlie', gamesWon: 8 });
  });

  it('should pick mostFearedEnemy with most losses against', () => {
    const stats: UserStats = {
      ...DEFAULT_STATS,
      enemies: {
        Charlie: { gamesWon: 8, gamesLost: 1 },
        Dave: { gamesWon: 2, gamesLost: 5 },
      },
    };
    expect(deriveStats(stats).mostFearedEnemy).toEqual({ pseudo: 'Dave', gamesLost: 5 });
  });
});
