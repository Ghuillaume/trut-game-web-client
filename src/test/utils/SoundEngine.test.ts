import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('SoundEngine', () => {
  describe('getTrutAnnouncementText', () => {
    it('should return default trut text', async () => {
      const { getTrutAnnouncementText } = await import('../../utils/SoundEngine');
      expect(getTrutAnnouncementText('Alice')).toBe('Alice a truté !');
    });

    it('should return deux pareilles text', async () => {
      const { getTrutAnnouncementText } = await import('../../utils/SoundEngine');
      expect(getTrutAnnouncementText('Bob', 'DEUX_PAREILLES')).toBe('Bob a deux pareilles une fausse !');
    });

    it('should return brellan text', async () => {
      const { getTrutAnnouncementText } = await import('../../utils/SoundEngine');
      expect(getTrutAnnouncementText('Charlie', 'BRELLAN')).toBe('Charlie annonce brelan !');
    });
  });

  describe('getPourriAnnouncementText', () => {
    it('should return pourri text', async () => {
      const { getPourriAnnouncementText } = await import('../../utils/SoundEngine');
      expect(getPourriAnnouncementText()).toBe('Pourri ! Qui pourrit dépourri !');
    });
  });

  describe('unlockAudio', () => {
    it('should not throw', async () => {
      const { unlockAudio } = await import('../../utils/SoundEngine');
      expect(() => unlockAudio()).not.toThrow();
    });
  });

  describe('playTableSlam', () => {
    it('should not throw when AudioContext is unavailable', async () => {
      const { playTableSlam } = await import('../../utils/SoundEngine');
      expect(() => playTableSlam()).not.toThrow();
    });
  });

  describe('playTrutAnnouncement', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

    it('should not throw', async () => {
      const { playTrutAnnouncement } = await import('../../utils/SoundEngine');
      expect(() => playTrutAnnouncement('Alice')).not.toThrow();
      vi.advanceTimersByTime(500);
    });

    it('should not throw for DEUX_PAREILLES', async () => {
      const { playTrutAnnouncement } = await import('../../utils/SoundEngine');
      expect(() => playTrutAnnouncement('Bob', 'DEUX_PAREILLES')).not.toThrow();
      vi.advanceTimersByTime(500);
    });

    it('should not throw for BRELLAN', async () => {
      const { playTrutAnnouncement } = await import('../../utils/SoundEngine');
      expect(() => playTrutAnnouncement('Charlie', 'BRELLAN')).not.toThrow();
      vi.advanceTimersByTime(500);
    });
  });

  describe('playPourriAnnouncement', () => {
    it('should not throw', async () => {
      const { playPourriAnnouncement } = await import('../../utils/SoundEngine');
      expect(() => playPourriAnnouncement()).not.toThrow();
    });
  });
});
