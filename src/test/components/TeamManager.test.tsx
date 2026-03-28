import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeamManager } from '../../components/lobby/TeamManager';
import type { PlayerView } from '../../types/game';

const PLAYERS: PlayerView[] = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 0 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_A', cardCount: 0, isAi: true },
  { id: 'p3', pseudo: 'Charlie', team: 'TEAM_B', cardCount: 0 },
  { id: 'p4', pseudo: 'Diana', team: 'TEAM_B', cardCount: 0 },
];

describe('TeamManager', () => {
  it('should render two team columns', () => {
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={vi.fn()} />);
    expect(screen.getByText('🔵 Équipe A')).toBeInTheDocument();
    expect(screen.getByText('🔴 Équipe B')).toBeInTheDocument();
  });

  it('should show players in correct teams', () => {
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={vi.fn()} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Bob/)).toBeInTheDocument();
    expect(screen.getByText(/Charlie/)).toBeInTheDocument();
    expect(screen.getByText(/Diana/)).toBeInTheDocument();
  });

  it('should call onSwap with the clicked player id', () => {
    const onSwap = vi.fn();
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={onSwap} />);
    fireEvent.click(screen.getByTestId('team-player-p3'));
    expect(onSwap).toHaveBeenCalledWith('p3');
  });

  it('should show AI icon for AI players', () => {
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={vi.fn()} />);
    expect(screen.getByTestId('team-player-p2').textContent).toContain('🤖');
  });

  it('should show (Moi) for current player', () => {
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={vi.fn()} />);
    expect(screen.getByTestId('team-player-p1').textContent).toContain('(Moi)');
  });

  it('should show swap arrows', () => {
    render(<TeamManager players={PLAYERS} currentPlayerId="p1" onSwap={vi.fn()} />);
    expect(screen.getByTestId('team-player-p1').textContent).toContain('→ B');
    expect(screen.getByTestId('team-player-p3').textContent).toContain('→ A');
  });
});
