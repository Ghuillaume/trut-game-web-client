export interface UserProfile {
  pseudo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoPlayerStats {
  gamesWon: number;
  gamesLost: number;
}

export interface EnemyStats {
  gamesWon: number;
  gamesLost: number;
}

export interface RecentGame {
  date: Date;
  result: 'win' | 'loss';
  teammates: string[];
  opponents: string[];
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  trutsWon: number;
  trutsLost: number;
  trutsCalled: number;
  trutsFolded: number;
  coPlayers: Record<string, CoPlayerStats>;
  enemies: Record<string, EnemyStats>;
  recentGames: RecentGame[];
}

export interface DerivedStats {
  winRate: number;
  favoriteCoplayer: { pseudo: string; gamesWon: number } | null;
  favoriteEnemy: { pseudo: string; gamesWon: number } | null;
  mostFearedEnemy: { pseudo: string; gamesLost: number } | null;
}

export function deriveStats(stats: UserStats): DerivedStats {
  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 1000) / 10
    : 0;

  const coEntries = Object.entries(stats.coPlayers);
  const favoriteCoplayer = coEntries.length > 0
    ? (() => {
        const [pseudo, s] = coEntries.reduce((a, b) => b[1].gamesWon > a[1].gamesWon ? b : a);
        return { pseudo, gamesWon: s.gamesWon };
      })()
    : null;

  const enemyEntries = Object.entries(stats.enemies);
  const favoriteEnemy = enemyEntries.length > 0
    ? (() => {
        const [pseudo, s] = enemyEntries.reduce((a, b) => b[1].gamesWon > a[1].gamesWon ? b : a);
        return { pseudo, gamesWon: s.gamesWon };
      })()
    : null;

  const mostFearedEnemy = enemyEntries.length > 0
    ? (() => {
        const [pseudo, s] = enemyEntries.reduce((a, b) => b[1].gamesLost > a[1].gamesLost ? b : a);
        return { pseudo, gamesLost: s.gamesLost };
      })()
    : null;

  return { winRate, favoriteCoplayer, favoriteEnemy, mostFearedEnemy };
}

export const DEFAULT_STATS: UserStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  trutsWon: 0,
  trutsLost: 0,
  trutsCalled: 0,
  trutsFolded: 0,
  coPlayers: {},
  enemies: {},
  recentGames: [],
};
