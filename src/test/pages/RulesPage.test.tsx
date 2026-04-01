import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RulesPage } from '../../pages/RulesPage';

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/rules']}>
      <RulesPage />
    </MemoryRouter>
  );
}

describe('RulesPage', () => {
  it('should render the rules page title', () => {
    renderWithRouter();
    expect(screen.getByText('Les Lois du Trut')).toBeInTheDocument();
  });

  it('should render the card hierarchy section', () => {
    renderWithRouter();
    expect(screen.getByTestId('card-hierarchy')).toBeInTheDocument();
    expect(screen.getByText("L'Ordre Royal")).toBeInTheDocument();
    expect(screen.getByText('Suprême')).toBeInTheDocument();
    expect(screen.getByText('Le Paysan')).toBeInTheDocument();
  });

  it('should render all eight cards in the hierarchy', () => {
    renderWithRouter();
    const cards = ['7', '8', 'As', 'Roi', 'Dame', 'Valet', '10', '9'];
    cards.forEach((card) => {
      expect(screen.getByText(card)).toBeInTheDocument();
    });
  });

  it('should render CTA buttons', () => {
    renderWithRouter();
    expect(screen.getByTestId('cta-lobby')).toBeInTheDocument();
    expect(screen.getByTestId('cta-lobby')).toHaveTextContent('ENTRER AU LOBBY');
    expect(screen.getByTestId('cta-training')).toBeInTheDocument();
    expect(screen.getByTestId('cta-training')).toHaveTextContent('MODE ENTRAINEMENT');
  });

  it('should render the scoring section', () => {
    renderWithRouter();
    expect(screen.getByText('La Main Gagnante')).toBeInTheDocument();
    expect(screen.getByText('Le Fortial')).toBeInTheDocument();
  });
});
