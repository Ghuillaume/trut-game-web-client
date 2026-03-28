import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JoinGameForm } from '../../components/lobby/JoinGameForm';

describe('JoinGameForm', () => {
  it('should render inputs and button', () => {
    render(<JoinGameForm onSubmit={() => {}} />);
    expect(screen.getByTestId('gameid-input')).toBeInTheDocument();
    expect(screen.getByTestId('join-pseudo-input')).toBeInTheDocument();
    expect(screen.getByTestId('join-btn')).toBeInTheDocument();
  });
  it('should disable button when empty', () => {
    render(<JoinGameForm onSubmit={() => {}} />);
    expect(screen.getByTestId('join-btn')).toBeDisabled();
  });
  it('should pre-fill gameId', () => {
    render(<JoinGameForm onSubmit={() => {}} initialGameId="test-id" />);
    expect(screen.getByTestId('gameid-input')).toHaveValue('test-id');
  });
  it('should call onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<JoinGameForm onSubmit={onSubmit} />);
    await user.type(screen.getByTestId('gameid-input'), 'game123');
    await user.type(screen.getByTestId('join-pseudo-input'), 'Bob');
    await user.click(screen.getByTestId('join-btn'));
    expect(onSubmit).toHaveBeenCalledWith('game123', 'Bob');
  });
});
