import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TokenDisplay } from '../../components/shared/TokenDisplay';

describe('TokenDisplay', () => {
  it('should render label and scores', () => {
    render(<TokenDisplay label="TEAM_A (Moi)" score={{ grands: 3, petits: 1 }} />);
    expect(screen.getByText('TEAM_A (Moi)')).toBeInTheDocument();
    expect(screen.getByText('3/7')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();
    // Check that TRUT tokens are rendered
    expect(screen.getAllByText('TRUT')).toHaveLength(3);
    expect(screen.getAllByText('Pigeon')).toHaveLength(1);
  });
  it('should apply highlight when set', () => {
    const { container } = render(<TokenDisplay label="T" score={{ grands: 0, petits: 0 }} highlight />);
    expect(container.querySelector('.token-highlight')).toBeTruthy();
  });
  it('should not highlight by default', () => {
    const { container } = render(<TokenDisplay label="T" score={{ grands: 0, petits: 0 }} />);
    expect(container.querySelector('.token-highlight')).toBeFalsy();
  });
  it('should show empty state when no tokens', () => {
    render(<TokenDisplay label="Test" score={{ grands: 0, petits: 0 }} />);
    expect(screen.getByText('0/7')).toBeInTheDocument();
    expect(screen.getByText('0/3')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
