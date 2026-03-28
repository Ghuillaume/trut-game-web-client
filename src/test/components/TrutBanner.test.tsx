import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrutBanner } from '../../components/game/TrutBanner';

const players = [
  { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 3 },
  { id: 'p2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 3 },
];

describe('TrutBanner', () => {
  it('should display challenger name for normal trut', () => {
    render(<TrutBanner challenge={{ challengerId: 'p1', status: 'PENDING', challengeType: 'TRUT' }} players={players} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/a truté/)).toBeInTheDocument();
  });
  it('should display status', () => {
    render(<TrutBanner challenge={{ challengerId: 'p2', status: 'ACCEPTED' }} players={players} />);
    expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
  });
  it('should display deux pareilles message', () => {
    render(<TrutBanner challenge={{ challengerId: 'p1', status: 'PENDING', challengeType: 'DEUX_PAREILLES' }} players={players} />);
    expect(screen.getByText(/deux pareilles une fausse/)).toBeInTheDocument();
    expect(screen.getByText('✌️')).toBeInTheDocument();
  });
  it('should display brellan message', () => {
    render(<TrutBanner challenge={{ challengerId: 'p2', status: 'PENDING', challengeType: 'BRELLAN' }} players={players} />);
    expect(screen.getByText(/brelan/)).toBeInTheDocument();
    expect(screen.getByText('🃏')).toBeInTheDocument();
  });
  it('should apply special CSS class for deux pareilles', () => {
    const { container } = render(
      <TrutBanner challenge={{ challengerId: 'p1', status: 'PENDING', challengeType: 'DEUX_PAREILLES' }} players={players} />
    );
    expect(container.querySelector('.trut-banner-deux-pareilles')).toBeTruthy();
  });
  it('should apply special CSS class for brellan', () => {
    const { container } = render(
      <TrutBanner challenge={{ challengerId: 'p1', status: 'PENDING', challengeType: 'BRELLAN' }} players={players} />
    );
    expect(container.querySelector('.trut-banner-brellan')).toBeTruthy();
  });
});
