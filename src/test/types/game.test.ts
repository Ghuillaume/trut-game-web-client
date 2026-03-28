import { describe, it, expect } from 'vitest';
import { cardLabel, suitColor, phaseLabel } from '../../types/game';

describe('cardLabel', () => {
  it('should format SEVEN_HEARTS', () => { expect(cardLabel('SEVEN_HEARTS')).toBe('7 ♥'); });
  it('should format ACE_SPADES', () => { expect(cardLabel('ACE_SPADES')).toBe('As ♠'); });
  it('should format QUEEN_DIAMONDS', () => { expect(cardLabel('QUEEN_DIAMONDS')).toBe('Dame ♦'); });
  it('should format KING_CLUBS', () => { expect(cardLabel('KING_CLUBS')).toBe('Roi ♣'); });
});

describe('suitColor', () => {
  it('should be red for HEARTS', () => { expect(suitColor('SEVEN_HEARTS')).toBe('red'); });
  it('should be red for DIAMONDS', () => { expect(suitColor('ACE_DIAMONDS')).toBe('red'); });
  it('should be black for CLUBS', () => { expect(suitColor('KING_CLUBS')).toBe('black'); });
  it('should be black for SPADES', () => { expect(suitColor('JACK_SPADES')).toBe('black'); });
});

describe('phaseLabel', () => {
  it('should label WAITING_FOR_PLAYERS', () => { expect(phaseLabel('WAITING_FOR_PLAYERS')).toBe('En attente de joueurs'); });
  it('should label PLAYING_TRICK', () => { expect(phaseLabel('PLAYING_TRICK')).toBe('Jeu en cours'); });
  it('should label TRUT_CHALLENGE', () => { expect(phaseLabel('TRUT_CHALLENGE')).toBe('Défi Trut !'); });
  it('should label GAME_OVER', () => { expect(phaseLabel('GAME_OVER')).toBe('Partie terminée'); });
  it('should return raw for unknown', () => { expect(phaseLabel('X')).toBe('X'); });
});
