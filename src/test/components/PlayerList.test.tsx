import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerList } from '../../components/lobby/PlayerList';

const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 0 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 0 },
];

describe('PlayerList', () => {
  it('should display player count', () => {
    render(<PlayerList players={players} />);
    expect(screen.getByText('Joueurs (2/4)')).toBeInTheDocument();
  });
  it('should display player names', () => {
    render(<PlayerList players={players} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
  it('should show Moi badge', () => {
    render(<PlayerList players={players} currentPlayerId="p1" />);
    expect(screen.getByText('Moi')).toBeInTheDocument();
  });
  it('should show waiting message', () => {
    render(<PlayerList players={players} />);
    expect(screen.getByText(/En attente de 2 joueur/)).toBeInTheDocument();
  });
  it('should not show waiting with 4 players', () => {
    const four = [...players, { id: 'p3', pseudo: 'C', team: 'TEAM_A', cardCount: 0 }, { id: 'p4', pseudo: 'D', team: 'TEAM_B', cardCount: 0 }];
    render(<PlayerList players={four} />);
    expect(screen.queryByText(/En attente/)).not.toBeInTheDocument();
  });
});
