import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  return initializeApp({ credential: cert(serviceAccount) });
}

/** Lazy-initialized admin Firestore instance */
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getFirestore(getAdminApp());
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  },
});

const adminApp = new Proxy({} as ReturnType<typeof getAdminApp>, {
  get(_target, prop) {
    const app = getAdminApp();
    const value = (app as any)[prop];
    return typeof value === 'function' ? value.bind(app) : value;
  },
});

export default adminApp;
