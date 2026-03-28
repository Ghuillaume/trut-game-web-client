import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerHand } from '../../components/game/PlayerHand';

describe('PlayerHand', () => {
  const cards = ['SEVEN_HEARTS', 'ACE_SPADES', 'KING_CLUBS'];
  it('should render all cards', () => {
    render(<PlayerHand cards={cards} selectedCard={null} onSelectCard={() => {}} canPlay />);
    expect(screen.getByTestId('card-SEVEN_HEARTS')).toBeInTheDocument();
    expect(screen.getByTestId('card-ACE_SPADES')).toBeInTheDocument();
    expect(screen.getByTestId('card-KING_CLUBS')).toBeInTheDocument();
  });
  it('should show empty message', () => {
    render(<PlayerHand cards={[]} selectedCard={null} onSelectCard={() => {}} canPlay />);
    expect(screen.getByText('Aucune carte')).toBeInTheDocument();
  });
  it('should call onSelectCard', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PlayerHand cards={cards} selectedCard={null} onSelectCard={onSelect} canPlay />);
    await user.click(screen.getByTestId('card-SEVEN_HEARTS'));
    expect(onSelect).toHaveBeenCalledWith('SEVEN_HEARTS');
  });
});
