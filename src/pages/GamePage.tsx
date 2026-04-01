import { useState, useCallback, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useGameSocket } from '../hooks/useGameSocket';
import { useGameState } from '../hooks/useGameState';
import { useGameAnnouncements } from '../hooks/useGameAnnouncements';
import { GameBoard } from '../components/game/GameBoard';
import { PlayerHand } from '../components/game/PlayerHand';
import { OpponentZone } from '../components/game/OpponentZone';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { ActionPanel } from '../components/game/ActionPanel';
import { EventLog } from '../components/game/EventLog';
import { TrutBanner } from '../components/game/TrutBanner';
import { RoundRecap } from '../components/game/RoundRecap';
import { AnnouncementOverlay } from '../components/game/AnnouncementOverlay';
import { TrickHistory } from '../components/game/TrickHistory';
import { GameOverPanel } from '../components/game/GameOverPanel';
import { TurnIndicator } from '../components/game/TurnIndicator';
import { isMuted, setMuted } from '../utils/SoundEngine';
import { phaseLabel } from '../types/game';
import './GamePage.css';

export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const playerId = useGameStore((s) => s.playerId);
  const events = useGameStore((s) => s.events);
  const error = useGameStore((s) => s.error);
  const reset = useGameStore((s) => s.reset);

  const { sendAction } = useGameSocket(gameId ?? null, playerId);
  const { gameView, isMyTurn, sortedPlayers, canPlayCard, canTrut, canCall, canFold, canBrellan, canDeuxPareilles } =
    useGameState();

  const { announcement, clearAnnouncement, showRecap } = useGameAnnouncements({
    trutChallenge: gameView?.trutChallenge ?? null,
    players: gameView?.players ?? [],
    completedTricks: gameView?.completedTricks ?? [],
    phase: gameView?.phase ?? '',
    currentTrickLength: gameView?.currentTrick?.length ?? 0,
  });

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const handlePlayCard = useCallback(() => {
    if (!selectedCard || !playerId) return;
    sendAction({ playerId, type: 'PLAY_CARD', cardId: selectedCard });
    setSelectedCard(null);
  }, [selectedCard, playerId, sendAction]);

  const handleTrut = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'TRUT' });
  }, [playerId, sendAction]);

  const handleCall = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'CALL' });
  }, [playerId, sendAction]);

  const handleFold = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'FOLD' });
  }, [playerId, sendAction]);

  const handleBrellan = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'BRELLAN' });
  }, [playerId, sendAction]);

  const handleDeuxPareilles = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'DEUX_PAREILLES' });
  }, [playerId, sendAction]);

  const handleNextRound = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'START_NEW_ROUND' });
  }, [playerId, sendAction]);

  const handleNewGame = () => {
    reset();
    navigate('/');
  };

  const handleRematch = useCallback(() => {
    if (!playerId) return;
    sendAction({ playerId, type: 'REMATCH' });
  }, [playerId, sendAction]);

  const disconnectedPlayers = gameView?.disconnectedPlayers ?? [];

  if (!gameId || !playerId) {
    navigate('/');
    return null;
  }

  if (!gameView) {
    return (
      <div className="game-page" data-testid="game-page">
        <p className="game-loading">Chargement de la partie…</p>
      </div>
    );
  }

  const otherPlayers = sortedPlayers.slice(1);
  const positions: Array<'left' | 'top' | 'right'> = ['left', 'top', 'right'];

  const playerPositionMap: Record<string, string> = {};
  playerPositionMap[gameView.players.find(p => p.id === playerId)?.id ?? ''] = 'bottom';
  otherPlayers.forEach((p, i) => {
    playerPositionMap[p.id] = positions[i] ?? 'top';
  });

  const currentPlayerPseudo = gameView.players.find(
    (p) => p.id === gameView.currentPlayerId
  )?.pseudo;

  const isEndOfRound = gameView.phase === 'END_OF_ROUND';

  const getTrutBadge = (pid: string): 'trute' | 'suivi' | null => {
    const challenge = gameView.trutChallenge;
    if (!challenge || challenge.status !== 'ACCEPTED') return null;
    if (pid === challenge.challengerId) return 'trute';
    if (pid === challenge.calledPlayerId) return 'suivi';
    return null;
  };

  return (
    <div className="game-page" data-testid="game-page">
      <div className="game-top-bar">
        <ScoreBoard
          score={gameView.score}
          myTeam={gameView.myTeam}
          roundNumber={gameView.roundNumber}
          fortial={gameView.fortial}
          players={gameView.players}
        />
        <button className="mute-btn" onClick={() => { setMuted(!isMuted()); forceUpdate(); }}>
          {isMuted() ? '🔇' : '🔊'}
        </button>
        <div className="game-phase" data-testid="game-phase">
          {phaseLabel(gameView.phase)}
        </div>
      </div>

      <TrickHistory
        completedTricks={gameView.completedTricks ?? []}
        myTeam={gameView.myTeam}
        maxTricks={3}
      />

      {error && <div className="game-error" data-testid="game-error">{error}</div>}

      {disconnectedPlayers.length > 0 && (
        <div className="disconnect-banner" data-testid="disconnect-banner">
          ⚠️ Joueur{disconnectedPlayers.length > 1 ? 's' : ''} déconnecté{disconnectedPlayers.length > 1 ? 's' : ''} :{' '}
          {disconnectedPlayers.map(pid =>
            gameView.players.find(p => p.id === pid)?.pseudo ?? '?'
          ).join(', ')}
          {' — Partie en pause (60s)'}
        </div>
      )}

      {gameView.trutChallenge && (
        <TrutBanner challenge={gameView.trutChallenge} players={gameView.players} />
      )}

      {gameView.phase === 'PLAYING_TRICK' && currentPlayerPseudo && (
        <TurnIndicator isMyTurn={isMyTurn} currentPlayerName={currentPlayerPseudo} />
      )}

      <div className="game-table">
        {otherPlayers.map((p, i) => (
          <OpponentZone
            key={p.id}
            player={p}
            isCurrentPlayer={p.id === gameView.currentPlayerId}
            position={positions[i] ?? 'top'}
            trutBadge={getTrutBadge(p.id)}
          />
        ))}
        <GameBoard
          currentTrick={gameView.currentTrick}
          completedTricks={gameView.completedTricks ?? []}
          players={gameView.players}
          playerCount={gameView.players.length}
          playerPositionMap={playerPositionMap}
        />
      </div>

      {isEndOfRound && !showRecap && (
        <div className="end-round-transition">Fin de la manche…</div>
      )}

      {isEndOfRound && showRecap && (
        <RoundRecap
          completedTricks={gameView.completedTricks ?? []}
          players={gameView.players}
          trutChallenge={gameView.trutChallenge}
          onNextRound={handleNextRound}
        />
      )}

      {!isEndOfRound && (
        <>
          {getTrutBadge(playerId!) === 'trute' && (
            <div className="self-trut-badge trut-badge trut-badge-trute">Truté !</div>
          )}
          {getTrutBadge(playerId!) === 'suivi' && (
            <div className="self-trut-badge trut-badge trut-badge-suivi">Suivi !</div>
          )}

          <PlayerHand
            cards={gameView.myHand}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            canPlay={canPlayCard}
          />

          <ActionPanel
            selectedCard={selectedCard}
            canPlayCard={canPlayCard}
            canTrut={canTrut}
            canCall={canCall}
            canFold={canFold}
            canBrellan={canBrellan}
            canDeuxPareilles={canDeuxPareilles}
            isMyTurn={isMyTurn}
            onPlayCard={handlePlayCard}
            onTrut={handleTrut}
            onCall={handleCall}
            onFold={handleFold}
            onBrellan={handleBrellan}
            onDeuxPareilles={handleDeuxPareilles}
          />
        </>
      )}

      {gameView.phase === 'GAME_OVER' && (
        <GameOverPanel
          winner={gameView.winner}
          myTeam={gameView.myTeam}
          players={gameView.players}
          rematchVotes={gameView.rematchVotes ?? []}
          playerId={playerId!}
          onRematch={handleRematch}
          onQuit={handleNewGame}
        />
      )}

      <EventLog events={events} />

      {announcement && (
        <AnnouncementOverlay
          text={announcement.text}
          type={announcement.type}
          onDone={clearAnnouncement}
        />
      )}
    </div>
  );
}
