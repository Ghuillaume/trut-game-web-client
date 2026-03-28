import { create } from 'zustand';
import type { GameView } from '../types/game';

interface GameStore {
  pseudo: string;
  playerId: string | null;
  gameId: string | null;
  gameView: GameView | null;
  events: string[];
  error: string | null;
  connected: boolean;

  setPseudo: (pseudo: string) => void;
  setPlayerId: (playerId: string) => void;
  setGameId: (gameId: string) => void;
  setGameView: (view: GameView) => void;
  addEvent: (event: string) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  reset: () => void;
}

const initialState = {
  pseudo: '',
  playerId: null as string | null,
  gameId: null as string | null,
  gameView: null as GameView | null,
  events: [] as string[],
  error: null as string | null,
  connected: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setPseudo: (pseudo) => set({ pseudo }),
  setPlayerId: (playerId) => {
    set({ playerId });
    if (playerId) localStorage.setItem('playerId', playerId);
  },
  setGameId: (gameId) => {
    set({ gameId });
    if (gameId) localStorage.setItem('gameId', gameId);
  },
  setGameView: (gameView) => set({ gameView }),
  addEvent: (event) => set((s) => ({ events: [...s.events.slice(-49), event] })),
  setError: (error) => set({ error }),
  setConnected: (connected) => set({ connected }),
  reset: () => {
    localStorage.removeItem('playerId');
    localStorage.removeItem('gameId');
    set(initialState);
  },
}));
