import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../../components/game/GameBoard';

const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 3 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 3 },
];

const playerPositionMap: Record<string, string> = {
  p1: 'bottom',
  p2: 'top',
};

describe('GameBoard', () => {
  it('should show empty message', () => {
    render(
      <GameBoard
        currentTrick={[]}
        completedTricks={[]}
        players={players}
        playerCount={4}
        playerPositionMap={playerPositionMap}
      />
    );
    expect(screen.getByText('En attente des cartes…')).toBeInTheDocument();
  });

  it('should render trick entries', () => {
    render(
      <GameBoard
        currentTrick={[{ playerId: 'p1', card: 'SEVEN_HEARTS' }]}
        completedTricks={[]}
        players={players}
        playerCount={4}
        playerPositionMap={playerPositionMap}
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should render played card in correct position slot', () => {
    const { container } = render(
      <GameBoard
        currentTrick={[{ playerId: 'p2', card: 'NINE_SPADES' }]}
        completedTricks={[]}
        players={players}
        playerCount={4}
        playerPositionMap={playerPositionMap}
      />
    );
    const slot = container.querySelector('.slot-top');
    expect(slot).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should show won pile for winner', () => {
    const { container } = render(
      <GameBoard
        currentTrick={[]}
        completedTricks={[{
          entries: [
            { playerId: 'p1', card: 'SEVEN_HEARTS' },
            { playerId: 'p2', card: 'NINE_SPADES' },
          ],
          winnerTeam: 'TEAM_A',
          winnerId: 'p1',
        }]}
        players={players}
        playerCount={4}
        playerPositionMap={playerPositionMap}
      />
    );
    const pile = container.querySelector('.won-pile.pile-bottom');
    expect(pile).toBeInTheDocument();
    expect(container.querySelectorAll('.won-pile-card')).toHaveLength(1);
  });

  it('should not show won pile when no winnerId (pourri)', () => {
    const { container } = render(
      <GameBoard
        currentTrick={[]}
        completedTricks={[{
          entries: [{ playerId: 'p1', card: 'SEVEN_HEARTS' }],
          winnerTeam: null,
          winnerId: null,
        }]}
        players={players}
        playerCount={4}
        playerPositionMap={playerPositionMap}
      />
    );
    expect(container.querySelectorAll('.won-pile-card')).toHaveLength(0);
  });
});
