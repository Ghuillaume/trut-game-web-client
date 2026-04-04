import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates a new document in the `gameStats` collection when a game starts.
 * Uses gameId as the document ID — idempotent if called multiple times.
 */
export async function recordGameStart(
  gameId: string,
  pseudo: string,
  botCount: number,
): Promise<void> {
  const ref = doc(db, 'gameStats', gameId);
  await setDoc(ref, {
    pseudo,
    startedAt: serverTimestamp(),
    botCount,
  });
}

/**
 * Updates the `gameStats` document with the game duration once the game ends.
 */
export async function recordGameDuration(
  gameId: string,
  startedAt: Date,
): Promise<void> {
  const ref = doc(db, 'gameStats', gameId);
  const durationSeconds = Math.round((Date.now() - startedAt.getTime()) / 1000);
  await updateDoc(ref, { durationSeconds });
}
