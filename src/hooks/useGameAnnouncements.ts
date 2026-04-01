import { useState, useRef, useEffect } from 'react';
import type { TrutChallengeView, PlayerView, CompletedTrickView } from '../types/game';
import {
  playTrutAnnouncement,
  playPourriAnnouncement,
  playCardSound,
  playVictorySound,
  getTrutAnnouncementText,
  getPourriAnnouncementText,
} from '../utils/SoundEngine';

export interface AnnouncementState {
  text: string;
  type: 'trut' | 'deux-pareilles' | 'brellan' | 'pourri';
}

interface UseGameAnnouncementsParams {
  trutChallenge: TrutChallengeView | null;
  players: PlayerView[];
  completedTricks: CompletedTrickView[];
  phase: string;
  currentTrickLength: number;
}

interface UseGameAnnouncementsReturn {
  announcement: AnnouncementState | null;
  clearAnnouncement: () => void;
  showRecap: boolean;
}

export function useGameAnnouncements({
  trutChallenge,
  players,
  completedTricks,
  phase,
  currentTrickLength,
}: UseGameAnnouncementsParams): UseGameAnnouncementsReturn {
  const [announcement, setAnnouncement] = useState<AnnouncementState | null>(null);
  const [showRecap, setShowRecap] = useState(false);

  // Delay showing recap to let players see the last trick
  useEffect(() => {
    if (phase === 'END_OF_ROUND') {
      setShowRecap(false);
      const timer = setTimeout(() => setShowRecap(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowRecap(false);
    }
  }, [phase]);

  // Detect new trut challenge (null → non-null transition)
  const prevTrutRef = useRef<TrutChallengeView | null>(null);
  useEffect(() => {
    const current = trutChallenge ?? null;
    if (!prevTrutRef.current && current) {
      const challengerPseudo =
        players.find((p) => p.id === current.challengerId)?.pseudo ?? "Quelqu'un";

      const type: AnnouncementState['type'] =
        current.challengeType === 'DEUX_PAREILLES'
          ? 'deux-pareilles'
          : current.challengeType === 'BRELLAN'
            ? 'brellan'
            : 'trut';

      setAnnouncement({ text: getTrutAnnouncementText(challengerPseudo, current.challengeType), type });
      playTrutAnnouncement(challengerPseudo, current.challengeType);
    }
    prevTrutRef.current = current;
  }, [trutChallenge, players]);

  // Detect pourri trick (new completed trick with winnerTeam === null)
  const prevTrickCountRef = useRef(0);
  useEffect(() => {
    if (completedTricks.length > prevTrickCountRef.current && completedTricks.length > 0) {
      const lastTrick = completedTricks[completedTricks.length - 1];
      if (lastTrick.winnerTeam === null) {
        setAnnouncement({ text: getPourriAnnouncementText(), type: 'pourri' });
        playPourriAnnouncement();
      }
    }
    prevTrickCountRef.current = completedTricks.length;
  }, [completedTricks]);

  // Play card sound when a new card is played on the current trick
  const prevTrickLengthRef = useRef(0);
  useEffect(() => {
    if (currentTrickLength > prevTrickLengthRef.current) {
      playCardSound();
    }
    prevTrickLengthRef.current = currentTrickLength;
  }, [currentTrickLength]);

  // Play victory fanfare when game is over
  const prevPhaseRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (phase === 'GAME_OVER' && prevPhaseRef.current !== 'GAME_OVER') {
      playVictorySound();
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  return {
    announcement,
    clearAnnouncement: () => setAnnouncement(null),
    showRecap,
  };
}
