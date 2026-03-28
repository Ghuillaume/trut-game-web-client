import type { CreateGameResult, JoinGameResult, GameView } from '../types/game';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return response.json();
}

export function createGame(pseudo: string): Promise<CreateGameResult> {
  return request('/api/games', {
    method: 'POST',
    body: JSON.stringify({ pseudo }),
  });
}

export function joinGame(gameId: string, pseudo: string): Promise<JoinGameResult> {
  return request(`/api/games/${gameId}/join`, {
    method: 'POST',
    body: JSON.stringify({ pseudo }),
  });
}

export function getGameView(gameId: string, playerId: string): Promise<GameView> {
  return request(`/api/games/${gameId}?playerId=${playerId}`);
}

export function addAiPlayer(gameId: string, requestingPlayerId: string): Promise<void> {
  return request(`/api/games/${gameId}/add-ai`, {
    method: 'POST',
    body: JSON.stringify({ requestingPlayerId }),
  });
}

export function swapTeam(gameId: string, requestingPlayerId: string, targetPlayerId: string): Promise<void> {
  return request(`/api/games/${gameId}/swap-team`, {
    method: 'POST',
    body: JSON.stringify({ requestingPlayerId, targetPlayerId }),
  });
}
