import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateGameForm } from '../../components/lobby/CreateGameForm';

describe('CreateGameForm', () => {
  it('should render input and button', () => {
    render(<CreateGameForm onSubmit={() => {}} />);
    expect(screen.getByTestId('pseudo-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-btn')).toBeInTheDocument();
  });
  it('should disable button when empty', () => {
    render(<CreateGameForm onSubmit={() => {}} />);
    expect(screen.getByTestId('create-btn')).toBeDisabled();
  });
  it('should enable button with text', async () => {
    const user = userEvent.setup();
    render(<CreateGameForm onSubmit={() => {}} />);
    await user.type(screen.getByTestId('pseudo-input'), 'Alice');
    expect(screen.getByTestId('create-btn')).not.toBeDisabled();
  });
  it('should call onSubmit with trimmed pseudo', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CreateGameForm onSubmit={onSubmit} />);
    await user.type(screen.getByTestId('pseudo-input'), '  Alice  ');
    await user.click(screen.getByTestId('create-btn'));
    expect(onSubmit).toHaveBeenCalledWith('Alice');
  });
  it('should show loading text', () => {
    render(<CreateGameForm onSubmit={() => {}} loading />);
    expect(screen.getByText('Création…')).toBeInTheDocument();
  });
});
