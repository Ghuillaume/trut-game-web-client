import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoundRecap } from '../../components/game/RoundRecap';

const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 0 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 0 },
];

const completedTricks = [
  {
    entries: [
      { playerId: 'p1', card: 'SEVEN_HEARTS' },
      { playerId: 'p2', card: 'NINE_SPADES' },
    ],
    winnerTeam: 'TEAM_A',
  },
  {
    entries: [
      { playerId: 'p1', card: 'NINE_CLUBS' },
      { playerId: 'p2', card: 'NINE_DIAMONDS' },
    ],
    winnerTeam: null,
  },
];

describe('RoundRecap', () => {
  it('should display recap title', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByText(/Récapitulatif/)).toBeInTheDocument();
  });

  it('should show trick numbers', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByText('Pli 1')).toBeInTheDocument();
    expect(screen.getByText('Pli 2')).toBeInTheDocument();
  });

  it('should show winner for won trick', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByText(/TEAM_A/)).toBeInTheDocument();
  });

  it('should show pourri for tied trick', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByText(/Pourri/)).toBeInTheDocument();
  });

  it('should show next round button', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByTestId('next-round-btn')).toBeInTheDocument();
  });

  it('should call onNextRound when button clicked', async () => {
    const user = userEvent.setup();
    const onNextRound = vi.fn();
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={onNextRound} />);
    await user.click(screen.getByTestId('next-round-btn'));
    expect(onNextRound).toHaveBeenCalledOnce();
  });
});
