import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '../../components/shared/BottomNav';

function renderWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <BottomNav />
    </MemoryRouter>
  );
}

describe('BottomNav', () => {
  it('should render all four nav links', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('nav-jouer')).toBeInTheDocument();
    expect(screen.getByTestId('nav-profil')).toBeInTheDocument();
    expect(screen.getByTestId('nav-regles')).toBeInTheDocument();
    expect(screen.getByTestId('nav-lobby')).toBeInTheDocument();
  });

  it('should highlight Jouer tab on home route', () => {
    renderWithRoute('/');
    expect(screen.getByTestId('nav-jouer').className).toContain('bottom-nav-tab--active');
    expect(screen.getByTestId('nav-regles').className).not.toContain('bottom-nav-tab--active');
  });

  it('should highlight Règles tab on rules route', () => {
    renderWithRoute('/rules');
    expect(screen.getByTestId('nav-regles').className).toContain('bottom-nav-tab--active');
    expect(screen.getByTestId('nav-jouer').className).not.toContain('bottom-nav-tab--active');
  });

  it('should highlight Profil tab on profile route', () => {
    renderWithRoute('/profile');
    expect(screen.getByTestId('nav-profil').className).toContain('bottom-nav-tab--active');
    expect(screen.getByTestId('nav-jouer').className).not.toContain('bottom-nav-tab--active');
  });

  it('should render correct labels', () => {
    renderWithRoute('/');
    expect(screen.getByText('Jouer')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Règles')).toBeInTheDocument();
    expect(screen.getByText('Lobby')).toBeInTheDocument();
  });
});
