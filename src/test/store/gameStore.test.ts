import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../store/gameStore';

beforeEach(() => { useGameStore.getState().reset(); });

describe('gameStore', () => {
  it('should have initial state', () => {
    const s = useGameStore.getState();
    expect(s.pseudo).toBe('');
    expect(s.playerId).toBeNull();
    expect(s.gameId).toBeNull();
    expect(s.gameView).toBeNull();
    expect(s.events).toEqual([]);
    expect(s.error).toBeNull();
    expect(s.connected).toBe(false);
  });

  it('should set pseudo', () => {
    useGameStore.getState().setPseudo('Alice');
    expect(useGameStore.getState().pseudo).toBe('Alice');
  });

  it('should set playerId and persist to localStorage', () => {
    useGameStore.getState().setPlayerId('p1');
    expect(useGameStore.getState().playerId).toBe('p1');
    expect(localStorage.getItem('playerId')).toBe('p1');
  });

  it('should set gameId and persist to localStorage', () => {
    useGameStore.getState().setGameId('g1');
    expect(useGameStore.getState().gameId).toBe('g1');
    expect(localStorage.getItem('gameId')).toBe('g1');
  });

  it('should add events and cap at 50', () => {
    for (let i = 0; i < 55; i++) useGameStore.getState().addEvent('e' + i);
    expect(useGameStore.getState().events.length).toBe(50);
    expect(useGameStore.getState().events[49]).toBe('e54');
  });

  it('should set and clear error', () => {
    useGameStore.getState().setError('oops');
    expect(useGameStore.getState().error).toBe('oops');
    useGameStore.getState().setError(null);
    expect(useGameStore.getState().error).toBeNull();
  });

  it('should reset state and clear localStorage', () => {
    useGameStore.getState().setPlayerId('p1');
    useGameStore.getState().setGameId('g1');
    useGameStore.getState().reset();
    expect(useGameStore.getState().playerId).toBeNull();
    expect(localStorage.getItem('playerId')).toBeNull();
  });
});
