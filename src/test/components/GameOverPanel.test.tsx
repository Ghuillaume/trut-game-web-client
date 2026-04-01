import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameOverPanel } from '../../components/game/GameOverPanel';
import type { PlayerView } from '../../types/game';

const players: PlayerView[] = [
  { id: 'p1', pseudo: 'Alice', team: 'A', cardCount: 3 },
  { id: 'p2', pseudo: 'Bob', team: 'B', cardCount: 3 },
  { id: 'p3', pseudo: 'Charlie', team: 'A', cardCount: 3 },
  { id: 'p4', pseudo: 'Diana', team: 'B', cardCount: 3, isAi: true },
];

const base = {
  winner: 'A' as string | null,
  myTeam: 'A',
  players,
  rematchVotes: [] as string[],
  playerId: 'p1',
  onRematch: vi.fn(),
  onQuit: vi.fn(),
};

describe('GameOverPanel', () => {
  it('should display winner team names', () => {
    render(<GameOverPanel {...base} />);
    expect(screen.getByText(/Alice et Charlie/)).toBeInTheDocument();
  });

  it('should display "?" when winner is null', () => {
    render(<GameOverPanel {...base} winner={null} />);
    expect(screen.getByText(/\?/)).toBeInTheDocument();
  });

  it('should show rematch button enabled when not voted', () => {
    render(<GameOverPanel {...base} />);
    const btn = screen.getByTestId('rematch-btn');
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveTextContent('Nouvelle partie');
  });

  it('should show rematch button disabled when already voted', () => {
    render(<GameOverPanel {...base} rematchVotes={['p1']} />);
    const btn = screen.getByTestId('rematch-btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Vote enregistré');
  });

  it('should call onRematch when clicking rematch', async () => {
    const user = userEvent.setup();
    const onRematch = vi.fn();
    render(<GameOverPanel {...base} onRematch={onRematch} />);
    await user.click(screen.getByTestId('rematch-btn'));
    expect(onRematch).toHaveBeenCalledOnce();
  });

  it('should call onQuit when clicking quit', async () => {
    const user = userEvent.setup();
    const onQuit = vi.fn();
    render(<GameOverPanel {...base} onQuit={onQuit} />);
    await user.click(screen.getByTestId('new-game-btn'));
    expect(onQuit).toHaveBeenCalledOnce();
  });

  it('should show rematch vote count excluding AI players', () => {
    render(<GameOverPanel {...base} rematchVotes={['p1']} />);
    const status = screen.getByTestId('rematch-status');
    // 3 human players (p4 is AI)
    expect(status).toHaveTextContent('1/3 votes');
    expect(status).toHaveTextContent('Alice');
  });

  it('should not show rematch status when no votes', () => {
    render(<GameOverPanel {...base} rematchVotes={[]} />);
    expect(screen.queryByTestId('rematch-status')).not.toBeInTheDocument();
  });
});
