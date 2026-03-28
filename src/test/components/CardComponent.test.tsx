import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardComponent } from '../../components/shared/CardComponent';

describe('CardComponent', () => {
  it('should render card face with label', () => {
    render(<CardComponent cardId="SEVEN_HEARTS" />);
    expect(screen.getByText('7 ♥')).toBeInTheDocument();
  });
  it('should render card back when faceDown', () => {
    render(<CardComponent faceDown />);
    expect(screen.getByText('🂠')).toBeInTheDocument();
  });
  it('should render card back when no cardId', () => {
    render(<CardComponent />);
    expect(screen.getByText('🂠')).toBeInTheDocument();
  });
  it('should apply red color for hearts', () => {
    const { container } = render(<CardComponent cardId="ACE_HEARTS" />);
    expect(container.querySelector('.red')).toBeTruthy();
  });
  it('should apply black color for spades', () => {
    const { container } = render(<CardComponent cardId="KING_SPADES" />);
    expect(container.querySelector('.black')).toBeTruthy();
  });
  it('should apply selected class', () => {
    const { container } = render(<CardComponent cardId="SEVEN_HEARTS" selected />);
    expect(container.querySelector('.card-selected')).toBeTruthy();
  });
  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CardComponent cardId="SEVEN_HEARTS" onClick={onClick} />);
    await user.click(screen.getByTestId('card-SEVEN_HEARTS'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('should not be clickable without onClick', () => {
    render(<CardComponent cardId="SEVEN_HEARTS" />);
    expect(screen.getByTestId('card-SEVEN_HEARTS').getAttribute('role')).toBeNull();
  });
});
