import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Firebase to avoid requiring a real API key in unit tests
vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('../lib/statsService', () => ({
  getUserProfile: vi.fn().mockResolvedValue(null),
  upsertUserProfile: vi.fn().mockResolvedValue(undefined),
  getUserStats: vi.fn().mockResolvedValue(null),
  recordGameResult: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../lib/gameStatsService', () => ({
  recordGameStart: vi.fn().mockResolvedValue(undefined),
  recordGameDuration: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../lib/authService', () => ({
  signUpWithEmail: vi.fn(),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  initAuthListener: vi.fn().mockReturnValue(() => {}),
  cachePseudo: vi.fn(),
  getCachedPseudo: vi.fn().mockReturnValue(null),
  clearCachedPseudo: vi.fn(),
}));
