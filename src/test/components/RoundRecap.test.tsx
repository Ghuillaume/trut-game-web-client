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
    winnerId: 'p1',
  },
  {
    entries: [
      { playerId: 'p1', card: 'NINE_CLUBS' },
      { playerId: 'p2', card: 'NINE_DIAMONDS' },
    ],
    winnerTeam: null,
    winnerId: null,
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
    expect(screen.getByText(/→ Alice/)).toBeInTheDocument();
  });

  it('should show pourri for tied trick', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByText(/Pourri/)).toBeInTheDocument();
  });

  it('should show next round button by default', () => {
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={() => {}} />);
    expect(screen.getByTestId('next-round-btn')).toBeInTheDocument();
  });

  it('should hide next round button when showNextRoundButton is false', () => {
    render(
      <RoundRecap
        completedTricks={completedTricks}
        players={players}
        onNextRound={() => {}}
        showNextRoundButton={false}
      />,
    );
    expect(screen.queryByTestId('next-round-btn')).not.toBeInTheDocument();
  });

  it('should call onNextRound when button clicked', async () => {
    const user = userEvent.setup();
    const onNextRound = vi.fn();
    render(<RoundRecap completedTricks={completedTricks} players={players} onNextRound={onNextRound} />);
    await user.click(screen.getByTestId('next-round-btn'));
    expect(onNextRound).toHaveBeenCalledOnce();
  });

  it('should show remaining cards section when round ended early with myHand', () => {
    const playersWithCards = [
      { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 1 },
      { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 1 },
    ];
    const twoTricks = [completedTricks[0]]; // Only 1 trick
    render(
      <RoundRecap
        completedTricks={twoTricks}
        players={playersWithCards}
        onNextRound={() => {}}
        myHand={['ACE_HEARTS']}
        myPlayerId="p1"
      />,
    );
    expect(screen.getByTestId('recap-remaining')).toBeInTheDocument();
    expect(screen.getByText(/Cartes non jouées/)).toBeInTheDocument();
  });

  it('should not show remaining cards section when all 3 tricks are completed', () => {
    const threeTricks = [
      ...completedTricks,
      { entries: [], winnerTeam: 'TEAM_B', winnerId: 'p2' },
    ];
    const playersNoCards = players.map(p => ({ ...p, cardCount: 0 }));
    render(
      <RoundRecap
        completedTricks={threeTricks}
        players={playersNoCards}
        onNextRound={() => {}}
        myHand={[]}
        myPlayerId="p1"
      />,
    );
    expect(screen.queryByTestId('recap-remaining')).not.toBeInTheDocument();
  });

  it('should show revealed hands from server when provided', () => {
    const twoTricks = [completedTricks[0]];
    const playersWithCards = [
      { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 1 },
      { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 1 },
    ];
    render(
      <RoundRecap
        completedTricks={twoTricks}
        players={playersWithCards}
        onNextRound={() => {}}
        revealedHands={{ p1: ['ACE_HEARTS'], p2: ['KING_CLUBS'] }}
        myPlayerId="p1"
      />,
    );
    expect(screen.getByTestId('recap-remaining')).toBeInTheDocument();
  });
});
