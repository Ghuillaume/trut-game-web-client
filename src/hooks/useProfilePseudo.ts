import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getUserProfile } from '../lib/statsService';
import { getCachedPseudo } from '../lib/authService';

/**
 * Returns the pseudo for the current user.
 * Fallback chain: Firestore → Firebase Auth displayName → localStorage cache → email prefix
 */
export function useProfilePseudo(uid: string | null): string {
  const user = useAuthStore((s) => s.user);
  const [firestorePseudo, setFirestorePseudo] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setFirestorePseudo(null);
      return;
    }
    getUserProfile(uid)
      .then((profile) => {
        if (profile?.pseudo) setFirestorePseudo(profile.pseudo);
      })
      .catch(() => {});
  }, [uid]);

  return (
    firestorePseudo ??
    user?.displayName ??
    getCachedPseudo() ??
    user?.email?.split('@')[0] ??
    ''
  );
}
