import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, UserStats, RecentGame } from '../types/auth';
import { DEFAULT_STATS } from '../types/auth';

// ─── User Profile ──────────────────────────────────────────────────────────

export async function upsertUserProfile(uid: string, data: { pseudo: string }): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { pseudo: data.pseudo, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { pseudo: data.pseudo, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    pseudo: data.pseudo,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

// ─── User Stats ────────────────────────────────────────────────────────────

export async function getUserStats(uid: string): Promise<UserStats> {
  const snap = await getDoc(doc(db, 'userStats', uid));
  if (!snap.exists()) return { ...DEFAULT_STATS };
  const d = snap.data() as UserStats;
  return {
    ...DEFAULT_STATS,
    ...d,
    recentGames: (d.recentGames ?? []).map((g: RecentGame & { date: Timestamp | Date }) => ({
      ...g,
      date: g.date instanceof Timestamp ? g.date.toDate() : new Date(g.date),
    })),
  };
}

// ─── Record Game Result ────────────────────────────────────────────────────

export interface GameResultPayload {
  won: boolean;
  teammates: string[];  // pseudos of players on same team (excluding self)
  opponents: string[];  // pseudos of players on opposing team
  trutsWon: number;
  trutsLost: number;
  trutsCalled: number;
  trutsFolded: number;
}

export async function recordGameResult(uid: string, payload: GameResultPayload): Promise<void> {
  const ref = doc(db, 'userStats', uid);
  const snap = await getDoc(ref);
  const current: UserStats = snap.exists() ? (snap.data() as UserStats) : { ...DEFAULT_STATS };

  const coPlayers: Record<string, { gamesWon: number; gamesLost: number }> = { ...(current.coPlayers ?? {}) };
  for (const p of payload.teammates) {
    const prev = coPlayers[p] ?? { gamesWon: 0, gamesLost: 0 };
    coPlayers[p] = {
      gamesWon: prev.gamesWon + (payload.won ? 1 : 0),
      gamesLost: prev.gamesLost + (payload.won ? 0 : 1),
    };
  }

  const enemies: Record<string, { gamesWon: number; gamesLost: number }> = { ...(current.enemies ?? {}) };
  for (const p of payload.opponents) {
    const prev = enemies[p] ?? { gamesWon: 0, gamesLost: 0 };
    enemies[p] = {
      gamesWon: prev.gamesWon + (payload.won ? 1 : 0),
      gamesLost: prev.gamesLost + (payload.won ? 0 : 1),
    };
  }

  const recentGame: RecentGame = {
    date: new Date(),
    result: payload.won ? 'win' : 'loss',
    teammates: payload.teammates,
    opponents: payload.opponents,
  };

  // Merge and cap recentGames at 10
  const existingRecent: RecentGame[] = (current.recentGames ?? []).slice(0, 9);

  const update = {
    gamesPlayed: (current.gamesPlayed ?? 0) + 1,
    gamesWon: (current.gamesWon ?? 0) + (payload.won ? 1 : 0),
    gamesLost: (current.gamesLost ?? 0) + (payload.won ? 0 : 1),
    trutsWon: (current.trutsWon ?? 0) + payload.trutsWon,
    trutsLost: (current.trutsLost ?? 0) + payload.trutsLost,
    trutsCalled: (current.trutsCalled ?? 0) + payload.trutsCalled,
    trutsFolded: (current.trutsFolded ?? 0) + payload.trutsFolded,
    coPlayers,
    enemies,
    recentGames: [recentGame, ...existingRecent],
  };

  if (snap.exists()) {
    await updateDoc(ref, update);
  } else {
    await setDoc(ref, update);
  }
}
