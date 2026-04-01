import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TurnIndicator } from '../../components/game/TurnIndicator';

describe('TurnIndicator', () => {
  it('should show "C\'est à vous de jouer !" when it is my turn', () => {
    render(<TurnIndicator isMyTurn={true} currentPlayerName="Alice" />);
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent("C'est à vous de jouer !");
  });

  it('should show opponent name when it is not my turn', () => {
    render(<TurnIndicator isMyTurn={false} currentPlayerName="Alice" />);
    expect(screen.getByTestId('turn-indicator')).toHaveTextContent("C'est au tour de Alice");
  });
});
