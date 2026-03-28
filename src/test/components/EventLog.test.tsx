import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventLog } from '../../components/game/EventLog';

describe('EventLog', () => {
  it('should show empty message', () => {
    render(<EventLog events={[]} />);
    expect(screen.getByText('Aucun événement')).toBeInTheDocument();
  });
  it('should render events in reverse order', () => {
    render(<EventLog events={['e1', 'e2', 'e3']} />);
    const items = screen.getAllByText(/^e\d$/);
    expect(items[0].textContent).toBe('e3');
    expect(items[2].textContent).toBe('e1');
  });
});
