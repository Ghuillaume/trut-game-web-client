import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGame, joinGame, getGameView } from '../../api/gameApi';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('gameApi', () => {
  describe('createGame', () => {
    it('should POST to /api/games and return result', async () => {
      const result = { gameId: 'g1', playerId: 'p1' };
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(result) });
      const res = await createGame('Alice');
      expect(mockFetch).toHaveBeenCalledWith('/api/games', expect.objectContaining({
        method: 'POST', body: JSON.stringify({ pseudo: 'Alice' }),
      }));
      expect(res).toEqual(result);
    });

    it('should throw on error response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400, text: () => Promise.resolve('Bad request') });
      await expect(createGame('')).rejects.toThrow('Bad request');
    });
  });

  describe('joinGame', () => {
    it('should POST to /api/games/{id}/join', async () => {
      const result = { playerId: 'p2', players: [] };
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(result) });
      const res = await joinGame('g1', 'Bob');
      expect(mockFetch).toHaveBeenCalledWith('/api/games/g1/join', expect.objectContaining({
        method: 'POST', body: JSON.stringify({ pseudo: 'Bob' }),
      }));
      expect(res).toEqual(result);
    });
  });

  describe('getGameView', () => {
    it('should GET /api/games/{id}?playerId={pid}', async () => {
      const view = { gameId: 'g1', phase: 'WAITING_FOR_PLAYERS' };
      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(view) });
      const res = await getGameView('g1', 'p1');
      expect(mockFetch).toHaveBeenCalledWith('/api/games/g1?playerId=p1', expect.any(Object));
      expect(res).toEqual(view);
    });
  });
});
