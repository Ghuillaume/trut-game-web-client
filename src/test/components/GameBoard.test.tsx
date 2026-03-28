import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../../components/game/GameBoard';

const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 3 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 3 },
];

describe('GameBoard', () => {
  it('should show empty message', () => {
    render(<GameBoard currentTrick={[]} completedTricks={[]} players={players} playerCount={4} />);
    expect(screen.getByText('Aucune carte jouée')).toBeInTheDocument();
  });

  it('should render trick entries', () => {
    render(
      <GameBoard
        currentTrick={[{ playerId: 'p1', card: 'SEVEN_HEARTS' }]}
        completedTricks={[]}
        players={players}
        playerCount={4}
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should show last trick winner', () => {
    render(
      <GameBoard
        currentTrick={[]}
        completedTricks={[{
          entries: [
            { playerId: 'p1', card: 'SEVEN_HEARTS' },
            { playerId: 'p2', card: 'NINE_SPADES' },
          ],
          winnerTeam: 'TEAM_A',
        }]}
        players={players}
        playerCount={4}
      />
    );
    expect(screen.getByText(/Pli remporté par TEAM_A/)).toBeInTheDocument();
  });

  it('should show pourri label when no winner', () => {
    render(
      <GameBoard
        currentTrick={[]}
        completedTricks={[{
          entries: [{ playerId: 'p1', card: 'SEVEN_HEARTS' }],
          winnerTeam: null,
        }]}
        players={players}
        playerCount={4}
      />
    );
    expect(screen.getByTestId('pourri-label')).toBeInTheDocument();
  });
});
