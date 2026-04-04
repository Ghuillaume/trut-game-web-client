import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';
import { useAuthStore } from '../store/authStore';
import { upsertUserProfile } from './statsService';

const PSEUDO_KEY = 'trut_pseudo';

export function cachePseudo(pseudo: string): void {
  localStorage.setItem(PSEUDO_KEY, pseudo);
}

export function getCachedPseudo(): string | null {
  return localStorage.getItem(PSEUDO_KEY);
}

export function clearCachedPseudo(): void {
  localStorage.removeItem(PSEUDO_KEY);
}

export async function signUpWithEmail(email: string, password: string, pseudo: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: pseudo });
  // onAuthStateChanged fires before updateProfile completes, so manually sync the store
  useAuthStore.getState().setUser(credential.user);
  // Cache pseudo in localStorage for instant, reliable retrieval
  cachePseudo(pseudo);
  // Await Firestore write — creates users/{uid} document
  try {
    await upsertUserProfile(credential.user.uid, { pseudo });
  } catch (err) {
    console.warn('Could not persist profile to Firestore:', err);
  }
  return credential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (credential.user.displayName) {
    cachePseudo(credential.user.displayName);
  }
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  clearCachedPseudo();
}

export function initAuthListener(): () => void {
  const { setUser, setInitialized } = useAuthStore.getState();
  return onAuthStateChanged(auth, (user) => {
    setUser(user);
    setInitialized();
    if (user) {
      const pseudo = user.displayName ?? getCachedPseudo();
      // Keep localStorage in sync
      if (pseudo) cachePseudo(pseudo);
      // Ensure Firestore document exists — retroactively fixes accounts registered
      // before Firestore was provisioned (fire-and-forget, non-blocking)
      if (pseudo) {
        upsertUserProfile(user.uid, { pseudo }).catch((err) => {
          console.warn('Could not sync profile to Firestore on login:', err);
        });
      }
    } else {
      clearCachedPseudo();
    }
  });
}
