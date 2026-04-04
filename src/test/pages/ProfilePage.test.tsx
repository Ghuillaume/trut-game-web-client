import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from '../../pages/ProfilePage';
import { useAuthStore } from '../../store/authStore';
import * as statsService from '../../lib/statsService';
import type { UserStats } from '../../types/auth';
import { DEFAULT_STATS } from '../../types/auth';

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProfile = { pseudo: 'Le Chevalier', createdAt: new Date(), updatedAt: new Date() };
const mockStats: UserStats = {
  ...DEFAULT_STATS,
  gamesPlayed: 20,
  gamesWon: 12,
  gamesLost: 8,
  trutsWon: 5,
  trutsLost: 2,
  trutsCalled: 3,
  trutsFolded: 1,
  coPlayers: { Alice: { gamesWon: 7, gamesLost: 3 } },
  enemies: { Bob: { gamesWon: 4, gamesLost: 6 } },
  recentGames: [{ date: new Date('2024-01-15'), result: 'win', teammates: ['Alice'], opponents: ['Bob', 'Charlie'] }],
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockImplementation((selector: (s: ReturnType<typeof useAuthStore>) => unknown) =>
      selector({
        user: { uid: 'test-uid' },
        loading: false, error: null, initialized: true,
        setUser: vi.fn(), setLoading: vi.fn(), setError: vi.fn(), setInitialized: vi.fn(),
      } as Parameters<typeof selector>[0])
    );
    vi.mocked(statsService.getUserProfile).mockResolvedValue(mockProfile);
    vi.mocked(statsService.getUserStats).mockResolvedValue(mockStats);
    mockNavigate.mockClear();
  });

  it('should show loading state initially', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  it('should display pseudo after loading', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Le Chevalier')).toBeInTheDocument());
  });

  it('should display win rate', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('winrate-card')).toBeInTheDocument());
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('should display total wins', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('wins-card')).toBeInTheDocument());
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should display favorite coplayer', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('coplayer-card')).toBeInTheDocument());
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should display recent game entry', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('chronicles-card')).toBeInTheDocument());
    expect(screen.getByText('Bob & Charlie')).toBeInTheDocument();
  });

  it('should display pseudo as plain text (not editable)', async () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Le Chevalier')).toBeInTheDocument());
    expect(screen.queryByTestId('edit-pseudo-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pseudo-edit-input')).not.toBeInTheDocument();
  });

  it('should redirect to /auth when not logged in', () => {
    vi.mocked(useAuthStore).mockImplementation((selector: (s: ReturnType<typeof useAuthStore>) => unknown) =>
      selector({
        user: null, loading: false, error: null, initialized: true,
        setUser: vi.fn(), setLoading: vi.fn(), setError: vi.fn(), setInitialized: vi.fn(),
      } as Parameters<typeof selector>[0])
    );
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });
});
