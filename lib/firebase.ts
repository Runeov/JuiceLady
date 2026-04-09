import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

function getApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0];

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return initializeApp(firebaseConfig);
}

function createLazyProxy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = factory();
      const value = (instance as any)[prop];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

/** Lazy-initialized Firestore instance */
export const db: Firestore = createLazyProxy(() => getFirestore(getApp()));

/** Lazy-initialized Auth instance */
export const auth: Auth = createLazyProxy(() => getAuth(getApp()));

/** Lazy-initialized Storage instance */
export const storage: FirebaseStorage = createLazyProxy(() => getStorage(getApp()));

const app = createLazyProxy(() => getApp());
export default app;
