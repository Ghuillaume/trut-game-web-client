import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreBoard } from '../../components/game/ScoreBoard';

const score = { TEAM_A: { grands: 3, petits: 1 }, TEAM_B: { grands: 2, petits: 0 } };

describe('ScoreBoard', () => {
  it('should display round number', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial={false} />);
    expect(screen.getByText('Manche 5')).toBeInTheDocument();
  });
  it('should display fortial indicator', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial />);
    expect(screen.getByTestId('fortial-indicator')).toBeInTheDocument();
  });
  it('should hide fortial indicator', () => {
    render(<ScoreBoard score={score} myTeam="TEAM_A" roundNumber={5} fortial={false} />);
    expect(screen.queryByTestId('fortial-indicator')).not.toBeInTheDocument();
  });
});
