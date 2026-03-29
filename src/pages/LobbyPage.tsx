import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerList } from '../components/lobby/PlayerList';
import { TeamManager } from '../components/lobby/TeamManager';
import { useGameStore } from '../store/gameStore';
import { useGameSocket } from '../hooks/useGameSocket';
import { addAiPlayer, swapTeam, startGame } from '../api/gameApi';
import './LobbyPage.css';

export function LobbyPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const storeGameId = useGameStore((s) => s.gameId);
  const playerId = useGameStore((s) => s.playerId);
  const gameView = useGameStore((s) => s.gameView);
  const connected = useGameStore((s) => s.connected);

  const resolvedGameId = gameId ?? storeGameId;
  useGameSocket(resolvedGameId, playerId);

  const [addingAi, setAddingAi] = useState(false);
  const [starting, setStarting] = useState(false);

  const isCreator = gameView?.creatorId === playerId;

  // Redirect to game when phase changes from WAITING
  useEffect(() => {
    if (gameView && gameView.phase !== 'WAITING_FOR_PLAYERS') {
      navigate(`/game/${resolvedGameId}`);
    }
  }, [gameView?.phase, resolvedGameId, navigate]);

  const shareUrl = `${window.location.origin}?join=${resolvedGameId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
  };

  const handleAddAi = useCallback(async () => {
    if (!resolvedGameId || !playerId) return;
    setAddingAi(true);
    try {
      await addAiPlayer(resolvedGameId, playerId);
    } catch (err) {
      console.error('Failed to add AI player:', err);
    } finally {
      setAddingAi(false);
    }
  }, [resolvedGameId, playerId]);

  const handleSwapTeam = useCallback(async (targetPlayerId: string) => {
    if (!resolvedGameId || !playerId) return;
    try {
      await swapTeam(resolvedGameId, playerId, targetPlayerId);
    } catch (err) {
      console.error('Failed to swap team:', err);
    }
  }, [resolvedGameId, playerId]);

  const handleStartGame = useCallback(async () => {
    if (!resolvedGameId || !playerId) return;
    setStarting(true);
    try {
      await startGame(resolvedGameId, playerId);
    } catch (err) {
      console.error('Failed to start game:', err);
    } finally {
      setStarting(false);
    }
  }, [resolvedGameId, playerId]);

  if (!resolvedGameId || !playerId) {
    navigate('/');
    return null;
  }

  const playerCount = gameView?.players.length ?? 0;

  return (
    <div className="lobby-page" data-testid="lobby-page">
      <h1>🃏 Salle d'attente</h1>

      <div className="lobby-status">
        {connected ? (
          <span className="lobby-connected">● Connecté</span>
        ) : (
          <span className="lobby-disconnected">○ Connexion…</span>
        )}
      </div>

      <div className="lobby-share">
        <p>Partagez ce lien pour inviter des joueurs :</p>
        <div className="lobby-link">
          <code data-testid="share-link">{shareUrl}</code>
          <button onClick={handleCopy} data-testid="copy-btn">Copier</button>
        </div>
        <p className="lobby-code">Code : <strong>{resolvedGameId}</strong></p>
      </div>

      {gameView && (
        <>
          <PlayerList players={gameView.players} currentPlayerId={playerId} />

          {isCreator && playerCount >= 2 && (
            <TeamManager
              players={gameView.players}
              currentPlayerId={playerId}
              onSwap={handleSwapTeam}
            />
          )}

          {isCreator && playerCount < 4 && (
            <button
              className="lobby-add-ai-btn"
              onClick={handleAddAi}
              disabled={addingAi}
              data-testid="add-ai-btn"
            >
              {addingAi ? 'Ajout en cours…' : `🤖 Ajouter une IA (${playerCount}/4)`}
            </button>
          )}

          {isCreator && playerCount === 4 && (
            <button
              className="lobby-start-btn"
              onClick={handleStartGame}
              disabled={starting}
              data-testid="start-game-btn"
            >
              {starting ? 'Lancement…' : '🚀 Lancer la partie'}
            </button>
          )}
        </>
      )}

      {(!gameView || playerCount < 4) && (
        <p className="lobby-waiting-text">
          En attente de {4 - playerCount} joueur(s) pour compléter la partie.
          {isCreator && ' Vous pouvez ajouter des IA pour compléter.'}
        </p>
      )}

      {playerCount === 4 && !isCreator && (
        <p className="lobby-waiting-text">
          En attente du lancement par le créateur de la partie…
        </p>
      )}
    </div>
  );
}
