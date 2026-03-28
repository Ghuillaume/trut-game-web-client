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
}

export interface ScoreView {
  grands: number;
  petits: number;
}

export interface CompletedTrickView {
  entries: TrickEntryView[];
  winnerTeam: string | null; // null = pourri
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
