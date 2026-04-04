export interface PlayerView {
  id: string;
  pseudo: string;
  team: string;
  cardCount: number;
  isAi?: boolean;
  connected?: boolean;
}

export interface TrickEntryView {
  playerId: string;
  card: string;
}

export interface TrutChallengeView {
  challengerId: string;
  status: string;
  challengeType?: string;
  foldedPlayerIds?: string[];
  calledPlayerId?: string | null;
}

export interface ScoreView {
  grands: number;
  petits: number;
}

export interface CompletedTrickView {
  entries: TrickEntryView[];
  winnerTeam: string | null; // null = pourri
  winnerId: string | null;
}

export interface GameView {
  gameId: string;
  phase: string;
  myHand: string[];
  myTeam: string;
  currentPlayerId: string;
  players: PlayerView[];
  currentTrick: TrickEntryView[];
  completedTricks: CompletedTrickView[];
  trutChallenge: TrutChallengeView | null;
  score: Record<string, ScoreView>;
  availableActions: string[];
  roundNumber: number;
  fortial: boolean;
  winner: string | null;
  rematchVotes?: string[];
  disconnectedPlayers?: string[];
  creatorId?: string;
  /** All players' remaining hands, revealed by the server at end of round */
  revealedHands?: Record<string, string[]>;
}

export interface CreateGameResult {
  gameId: string;
  playerId: string;
}

export interface JoinGameResult {
  playerId: string;
  players: PlayerView[];
}

export interface ActionMessage {
  playerId: string;
  type: string;
  cardId?: string;
}

export type GamePhase =
  | 'WAITING_FOR_PLAYERS'
  | 'DEALING'
  | 'PLAYING_TRICK'
  | 'TRUT_CHALLENGE'
  | 'FORTIAL_DECISION'
  | 'END_OF_ROUND'
  | 'GAME_OVER';

export type ActionType =
  | 'PLAY_CARD'
  | 'TRUT'
  | 'CALL'
  | 'FOLD'
  | 'BRELLAN'
  | 'DEUX_PAREILLES';

export const CARD_VALUES = ['SEVEN', 'EIGHT', 'ACE', 'KING', 'QUEEN', 'JACK', 'TEN', 'NINE'] as const;
export const SUITS = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'] as const;

export function cardLabel(cardId: string): string {
  const [value, suit] = cardId.split('_');
  const valueLabels: Record<string, string> = {
    SEVEN: '7', EIGHT: '8', ACE: 'As', KING: 'Roi',
    QUEEN: 'Dame', JACK: 'Valet', TEN: '10', NINE: '9',
  };
  const suitLabels: Record<string, string> = {
    HEARTS: '♥', DIAMONDS: '♦', CLUBS: '♣', SPADES: '♠',
  };
  return `${valueLabels[value] ?? value} ${suitLabels[suit] ?? suit}`;
}

export function suitColor(cardId: string): 'red' | 'black' {
  const suit = cardId.split('_')[1];
  return suit === 'HEARTS' || suit === 'DIAMONDS' ? 'red' : 'black';
}

export function phaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    WAITING_FOR_PLAYERS: 'En attente de joueurs',
    DEALING: 'Distribution',
    PLAYING_TRICK: 'Jeu en cours',
    TRUT_CHALLENGE: 'Défi Trut !',
    FORTIAL_DECISION: 'Fortial',
    END_OF_ROUND: 'Fin de manche',
    GAME_OVER: 'Partie terminée',
  };
  return labels[phase] ?? phase;
}

/** Returns player pseudos for a given team, e.g. "Alice et Bob" */
export function teamPlayerNames(players: PlayerView[], team: string): string {
  const names = players.filter((p) => p.team === team).map((p) => p.pseudo);
  return names.join(' et ') || team;
}

/**
 * Returns true when the round winner is already decided after 2 completed tricks,
 * making the 3rd trick unnecessary.
 * Cases:
 *   - The same team won both tricks (2 wins → round over)
 *   - The first trick was pourri (user-specified variant rule)
 */
export function isRoundDecidedAfterTwoTricks(
  completedTricks: CompletedTrickView[],
): boolean {
  if (completedTricks.length < 2) return false;

  const wins: Record<string, number> = {};
  completedTricks.forEach((t) => {
    if (t.winnerTeam) wins[t.winnerTeam] = (wins[t.winnerTeam] ?? 0) + 1;
  });
  if (Object.values(wins).some((w) => w >= 2)) return true;

  if (completedTricks[0]?.winnerTeam === null) return true;

  return false;
}
