/**
 * SoundEngine — plays pre-recorded audio files + Web Audio API sounds.
 *
 * Voice announcements use pre-generated audio files (public/audio/*.m4a).
 * Table slam uses Web Audio API noise burst.
 *
 * After the first user interaction (click/touch), HTMLAudioElement.play()
 * works from any context (WebSocket callbacks, useEffect, etc.).
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Pre-loaded audio elements for instant playback */
const audioCache: Map<string, HTMLAudioElement> = new Map();

function preloadAudio(key: string, src: string): void {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.load();
    audioCache.set(key, audio);
  } catch {
    // Silent fallback
  }
}

// Pre-load all announcement audio files
if (typeof window !== 'undefined') {
  const base = import.meta?.url ? '' : '';
  preloadAudio('trut', `${base}/audio/trut.m4a`);
  preloadAudio('deux_pareilles', `${base}/audio/deux_pareilles.m4a`);
  preloadAudio('brellan', `${base}/audio/brellan.m4a`);
  preloadAudio('pourri', `${base}/audio/pourri.m4a`);
}

/** Unlock AudioContext on first user interaction */
export function unlockAudio(): void {
  try {
    getAudioContext();
  } catch { /* ignore */ }
}

// Auto-unlock on first user interaction
if (typeof window !== 'undefined') {
  const autoUnlock = () => {
    unlockAudio();
    // Also trigger a silent play on cached audio to unlock HTMLAudioElement
    audioCache.forEach((audio) => {
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
    });
    window.removeEventListener('click', autoUnlock);
    window.removeEventListener('touchstart', autoUnlock);
  };
  window.addEventListener('click', autoUnlock, { once: true });
  window.addEventListener('touchstart', autoUnlock, { once: true });
}

/**
 * Play a pre-loaded audio clip by key.
 * Creates a fresh Audio element from the same source to allow overlapping plays.
 */
function playAudioClip(key: string): void {
  try {
    const cached = audioCache.get(key);
    if (cached) {
      // Clone to allow overlapping playback
      const clone = cached.cloneNode() as HTMLAudioElement;
      clone.play().catch(() => {});
      return;
    }
    // Fallback: try to play directly
    const audio = new Audio(`/audio/${key}.m4a`);
    audio.play().catch(() => {});
  } catch {
    // Silent fallback
  }
}

/**
 * Percussive "table slam" sound — short burst of filtered noise with fast decay.
 */
export function playTableSlam(): void {
  try {
    const ctx = getAudioContext();
    const duration = 0.15;
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 40);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    const gain = ctx.createGain();
    gain.gain.value = 3;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  } catch {
    // Audio not available — silent fallback
  }
}

/**
 * Returns the announcement text for the given challenge type.
 */
export function getTrutAnnouncementText(playerName: string, challengeType?: string): string {
  switch (challengeType) {
    case 'DEUX_PAREILLES':
      return `${playerName} a deux pareilles une fausse !`;
    case 'BRELLAN':
      return `${playerName} annonce brelan !`;
    default:
      return `${playerName} a truté !`;
  }
}

/**
 * Returns the announcement text for pourri.
 */
export function getPourriAnnouncementText(): string {
  return 'Pourri ! Qui pourrit dépourri !';
}

/**
 * Combined: table slam + voice clip for TRUT announcements.
 */
export function playTrutAnnouncement(_playerName: string, challengeType?: string): void {
  playTableSlam();

  const clipKey = challengeType === 'DEUX_PAREILLES' ? 'deux_pareilles'
    : challengeType === 'BRELLAN' ? 'brellan'
    : 'trut';

  setTimeout(() => playAudioClip(clipKey), 200);
}

/**
 * Pourri voice announcement.
 */
export function playPourriAnnouncement(): void {
  playAudioClip('pourri');
}
