import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useGameSocket } from '../hooks/useGameSocket';
import { useGameState } from '../hooks/useGameState';
import { GameBoard } from '../components/game/GameBoard';
import { PlayerHand } from '../components/game/PlayerHand';
import { OpponentZone } from '../components/game/OpponentZone';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { ActionPanel } from '../components/game/ActionPanel';
import { EventLog } from '../components/game/EventLog';
import { TrutBanner } from '../components/game/TrutBanner';
import { RoundRecap } from '../components/game/RoundRecap';
import { AnnouncementOverlay } from '../components/game/AnnouncementOverlay';
import { playTrutAnnouncement, playPourriAnnouncement, getTrutAnnouncementText, getPourriAnnouncementText } from '../utils/SoundEngine';
import { teamPlayerNames } from '../types/game';
import { phaseLabel } from '../types/game';
import type { TrutChallengeView } from '../types/game';
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

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showRecap, setShowRecap] = useState(false);

  // Delay showing recap to let players see the last trick
  useEffect(() => {
    if (gameView?.phase === 'END_OF_ROUND') {
      setShowRecap(false);
      const timer = setTimeout(() => setShowRecap(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowRecap(false);
    }
  }, [gameView?.phase]);

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

  const rematchVotes = gameView?.rematchVotes ?? [];
  const hasVotedRematch = playerId ? rematchVotes.includes(playerId) : false;
  const disconnectedPlayers = gameView?.disconnectedPlayers ?? [];

  // Announcement overlay state
  const [announcement, setAnnouncement] = useState<{
    text: string;
    type: 'trut' | 'deux-pareilles' | 'brellan' | 'pourri';
  } | null>(null);

  // Detect new trut challenge (null → non-null transition)
  const prevTrutRef = useRef<TrutChallengeView | null>(null);
  useEffect(() => {
    const current = gameView?.trutChallenge ?? null;
    if (!prevTrutRef.current && current) {
      const challengerPseudo = gameView?.players.find(
        (p) => p.id === current.challengerId
      )?.pseudo ?? 'Quelqu\'un';

      const type = current.challengeType === 'DEUX_PAREILLES' ? 'deux-pareilles'
        : current.challengeType === 'BRELLAN' ? 'brellan'
        : 'trut';

      setAnnouncement({ text: challengerPseudo, type });
      playTrutAnnouncement(challengerPseudo, current.challengeType);
    }
    prevTrutRef.current = current;
  }, [gameView?.trutChallenge, gameView?.players]);

  // Detect pourri trick (new completed trick with winnerTeam === null)
  const prevTrickCountRef = useRef(0);
  useEffect(() => {
    const tricks = gameView?.completedTricks ?? [];
    if (tricks.length > prevTrickCountRef.current && tricks.length > 0) {
      const lastTrick = tricks[tricks.length - 1];
      if (lastTrick.winnerTeam === null) {
        setAnnouncement({ text: 'Pourri ! Qui pourrit dépourri !', type: 'pourri' });
        playPourriAnnouncement();
      }
    }
    prevTrickCountRef.current = tricks.length;
  }, [gameView?.completedTricks]);

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

  // Position opponents around the table: left, top, right
  const otherPlayers = sortedPlayers.slice(1); // exclude self (index 0)
  const positions: Array<'left' | 'top' | 'right'> = ['left', 'top', 'right'];

  // Current player pseudo for "C'est à X de jouer"
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
        <div className="game-phase" data-testid="game-phase">
          {phaseLabel(gameView.phase)}
        </div>
      </div>

      {error && <div className="game-error" data-testid="game-error">{error}</div>}

      {/* Disconnection banner */}
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

      {/* Turn indicator */}
      {gameView.phase === 'PLAYING_TRICK' && currentPlayerPseudo && (
        <div className="turn-indicator" data-testid="turn-indicator">
          {gameView.currentPlayerId === playerId
            ? "C'est à vous de jouer !"
            : `C'est à ${currentPlayerPseudo} de jouer`}
        </div>
      )}

      {/* Game table — always shown so last trick remains visible during end-of-round delay */}
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
        <div className="game-over-panel" data-testid="game-over">
          <h2>🏆 Partie terminée !</h2>
          <p>
            Vainqueur : <strong>{gameView.winner ? teamPlayerNames(gameView.players, gameView.winner) : '?'}</strong>
          </p>
          <div className="game-over-actions">
            <button
              className="action-btn action-rematch"
              onClick={handleRematch}
              disabled={hasVotedRematch}
              data-testid="rematch-btn"
            >
              {hasVotedRematch ? '✅ Vote enregistré' : '🔄 Nouvelle partie'}
            </button>
            <button onClick={handleNewGame} data-testid="new-game-btn">
              🏠 Quitter
            </button>
          </div>
          {rematchVotes.length > 0 && (
            <p className="rematch-status" data-testid="rematch-status">
              Revanche : {rematchVotes.length}/{gameView.players.filter(p => !p.isAi).length} votes
              {rematchVotes.length > 0 && (
                <span className="rematch-voters">
                  {' '}({rematchVotes.map(vid => 
                    gameView.players.find(p => p.id === vid)?.pseudo ?? '?'
                  ).join(', ')})
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <EventLog events={events} />

      {/* Announcement overlay for trut/pourri */}
      {announcement && (
        <AnnouncementOverlay
          text={announcement.type === 'pourri'
            ? getPourriAnnouncementText()
            : getTrutAnnouncementText(announcement.text, announcement.type === 'deux-pareilles' ? 'DEUX_PAREILLES' : announcement.type === 'brellan' ? 'BRELLAN' : 'TRUT')}
          type={announcement.type}
          onDone={() => setAnnouncement(null)}
        />
      )}
    </div>
  );
}
