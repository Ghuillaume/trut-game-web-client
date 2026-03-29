import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGameStore } from '../store/gameStore';
import { getGameView } from '../api/gameApi';
import type { ActionMessage, GameView } from '../types/game';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? '';

export function useGameSocket(gameId: string | null, playerId: string | null) {
  const clientRef = useRef<Client | null>(null);
  const setGameView = useGameStore((s) => s.setGameView);
  const addEvent = useGameStore((s) => s.addEvent);
  const setError = useGameStore((s) => s.setError);
  const setConnected = useGameStore((s) => s.setConnected);

  useEffect(() => {
    if (!gameId || !playerId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      reconnectDelay: 3000,
      connectHeaders: {
        gameId: gameId,
        playerId: playerId,
      },
      onConnect: () => {
        setConnected(true);
        client.subscribe(
          `/topic/games/${gameId}/player/${playerId}`,
          (message) => {
            const view: GameView = JSON.parse(message.body);
            setGameView(view);
          }
        );
        client.subscribe(`/topic/games/${gameId}/events`, (message) => {
          addEvent(message.body);
        });
        client.subscribe(
          `/topic/games/${gameId}/player/${playerId}/errors`,
          (message) => {
            setError(message.body);
          }
        );

        // Fetch current state via REST to avoid missing updates published before WS subscription
        getGameView(gameId, playerId)
          .then((view) => setGameView(view))
          .catch(() => {/* WS will provide updates */});
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        setError(frame.headers['message'] ?? 'WebSocket error');
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [gameId, playerId, setGameView, addEvent, setError, setConnected]);

  const sendAction = useCallback(
    (action: ActionMessage) => {
      if (!clientRef.current?.connected || !gameId) return;
      clientRef.current.publish({
        destination: `/app/games/${gameId}/action`,
        body: JSON.stringify(action),
      });
    },
    [gameId]
  );

  return { sendAction };
}
