# Authentication — Technical Documentation

This document describes the sign-up, login, and logout flows for the Trut game client.
All authentication is handled client-side via the **Firebase JS SDK** (Firebase Auth + Firestore).

---

## Data stores

| Store | Purpose | Contents |
|---|---|---|
| **Firebase Auth** | Identity provider | email, password hash, `displayName` (= pseudo) |
| **Firestore `users/{uid}`** | User profile | `pseudo`, `createdAt`, `updatedAt` |
| **Firestore `userStats/{uid}`** | Game statistics | win/loss counters, trut stats, recent games |
| **`localStorage` (`trut_pseudo`)** | Instant cache | pseudo — survives page refreshes with zero async delay |
| **Zustand `authStore`** | React state | current `User` object, `loading`, `error`, `initialized` |

---

## Sign-up flow

```
User fills: pseudo, email, password
          │
          ▼
1. createUserWithEmailAndPassword(auth, email, password)
   → Firebase Auth creates the account
   → onAuthStateChanged fires immediately (user.displayName is still null at this point)
          │
          ▼
2. updateProfile(user, { displayName: pseudo })
   → Sets displayName on the Firebase Auth profile
          │
          ▼
3. authStore.setUser(user)
   → Manually syncs the Zustand store with the now-updated user
     (necessary because onAuthStateChanged already fired in step 1 with displayName=null)
          │
          ▼
4. cachePseudo(pseudo)
   → Saves pseudo to localStorage under key "trut_pseudo"
   → Makes the pseudo available synchronously on every future page load
          │
          ▼
5. upsertUserProfile(uid, { pseudo })   ← awaited
   → Creates the Firestore document users/{uid}
   → Contains: pseudo, createdAt, updatedAt (serverTimestamp)
   → If this fails (e.g. network error), a warning is logged but sign-up still succeeds
          │
          ▼
6. navigate('/profile')
```

### Why step 3 is needed

Firebase `onAuthStateChanged` fires as soon as the account is created (step 1), **before**
`updateProfile` has run (step 2). Without step 3, the Zustand store would hold a user with
`displayName = null`, breaking pseudo auto-fill in forms.

---

## Login flow

```
User fills: email, password
          │
          ▼
1. signInWithEmailAndPassword(auth, email, password)
   → Firebase Auth validates credentials
   → Returns the Firebase User object (displayName is set if updateProfile was called at sign-up)
          │
          ▼
2. cachePseudo(user.displayName)   (if displayName is not null)
   → Refreshes the localStorage cache
          │
          ▼
3. onAuthStateChanged fires (triggered by Firebase internally)
   → authStore.setUser(user)
   → authStore.setInitialized()
   → cachePseudo(user.displayName)   (second sync, ensures localStorage is up to date)
   → upsertUserProfile(uid, pseudo)  [fire-and-forget]
     → Ensures the Firestore document exists for this user
     → Retroactively creates it for accounts registered before Firestore was provisioned
          │
          ▼
4. navigate('/profile')   (called by AuthPage after signInWithEmail resolves)
```

### Pseudo resolution order (useProfilePseudo hook)

When rendering the pseudo (profile page, game creation form, join form), the hook tries each
source in order and uses the first non-empty value:

1. `Firestore users/{uid}.pseudo` — authoritative, async
2. `Firebase Auth user.displayName` — fast, from the restored session
3. `localStorage("trut_pseudo")` — instant, always available after first login
4. `user.email.split('@')[0]` — last resort, never empty

---

## Logout flow

```
1. firebaseSignOut(auth)
   → Firebase Auth clears the session from IndexedDB
          │
          ▼
2. clearCachedPseudo()
   → Removes "trut_pseudo" from localStorage
          │
          ▼
3. onAuthStateChanged fires with null
   → authStore.setUser(null)
   → clearCachedPseudo()   (second clear, defensive)
```

---

## Known limitations / design decisions

- **Password reset**: not implemented — users cannot reset their password from within the app.
- **Pseudo change**: the pseudo is set once at sign-up and is not editable from the UI.
  To change it, a developer must update the `users/{uid}.pseudo` document in Firestore and
  the `displayName` on the Firebase Auth profile directly.
- **Guest mode**: users can play without an account. Game statistics are not recorded for
  guest sessions.
- **Firestore Timestamps**: `createdAt` / `updatedAt` use `serverTimestamp()` and are
  converted to `Date` objects when read back.
