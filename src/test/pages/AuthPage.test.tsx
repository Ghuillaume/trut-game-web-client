import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthPage } from '../../pages/AuthPage';
import { useAuthStore } from '../../store/authStore';
import * as authService from '../../lib/authService';

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

describe('AuthPage', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockImplementation((selector: (s: ReturnType<typeof useAuthStore>) => unknown) =>
      selector({ user: null, loading: false, error: null, initialized: false, setUser: vi.fn(), setLoading: vi.fn(), setError: vi.fn(), setInitialized: vi.fn() } as Parameters<typeof selector>[0])
    );
    mockNavigate.mockClear();
  });

  it('should render login form by default', () => {
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.queryByTestId('pseudo-input')).not.toBeInTheDocument();
  });

  it('should show pseudo field when switching to register mode', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    await user.click(screen.getByText("S'inscrire"));
    expect(screen.getByTestId('pseudo-input')).toBeInTheDocument();
  });

  it('should navigate to home when skipping', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    await user.click(screen.getByText('Continuer sans compte →'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should call signInWithEmail on login submit', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.signInWithEmail).mockResolvedValueOnce({ uid: 'test-uid' } as ReturnType<typeof authService.signInWithEmail> extends Promise<infer T> ? T : never);
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('auth-submit'));
    await waitFor(() => expect(authService.signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password123'));
  });

  it('should display translated error for wrong password', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.signInWithEmail).mockRejectedValueOnce(new Error('Firebase: invalid-credential'));
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('password-input'), 'wrongpass');
    await user.click(screen.getByTestId('auth-submit'));
    await waitFor(() => expect(screen.getByTestId('auth-error')).toHaveTextContent('Email ou mot de passe incorrect.'));
  });
});
