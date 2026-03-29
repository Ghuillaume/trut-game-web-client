import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '../../components/game/ScoreBoard';

const score = { TEAM_A: { grands: 3, petits: 1 }, TEAM_B: { grands: 2, petits: 0 } };
const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 0 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_A', cardCount: 0 },
  { id: 'p3', pseudo: 'Charlie', team: 'TEAM_B', cardCount: 0 },
  { id: 'p4', pseudo: 'Diana', team: 'TEAM_B', cardCount: 0 },
];

describe('ScoreBoard', () => {
  it('should display round number', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial={false} players={players} />);
    expect(screen.getByText('Manche 5')).toBeInTheDocument();
  });
  it('should display fortial indicator', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial players={players} />);
    expect(screen.getByTestId('fortial-indicator')).toBeInTheDocument();
  });
  it('should hide fortial indicator', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial={false} players={players} />);
    expect(screen.queryByTestId('fortial-indicator')).not.toBeInTheDocument();
  });
});
