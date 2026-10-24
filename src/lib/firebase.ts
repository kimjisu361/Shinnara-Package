import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Client-side Firebase Configuration.
 * These are non-secret public identifiers provided by Firebase for client apps.
 * The actual security is strictly enforced by Firestore Security Rules & Netlify Serverless Functions.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBC3VXrmTjNAQ3iAewAgCjbJsYWK_2LeLg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'shinnara-package.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'shinnara-package',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'shinnara-package.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '464558937851',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:464558937851:web:51c9930e1733ea1815c25e',
};

/**
 * Target administrator email configured via environment variable.
 * Fallbacks to the project owner's designated email if not explicitly overridden.
 */
export const ADMIN_ALLOWED_EMAIL = (
  import.meta.env.VITE_ADMIN_ALLOWED_EMAIL || 'rlawltn2232@gmail.com'
).toLowerCase().trim();

/**
 * Checks whether Firebase configuration environment variables are properly set.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
  );
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    firestoreInstance = getFirestore(appInstance);
  } catch (error) {
    console.error('[Firebase Init Error]:', error);
  }
}

export const getAuthInstance = (): Auth | null => {
  if (authInstance) return authInstance;
  if (isFirebaseConfigured()) {
    try {
      appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      authInstance = getAuth(appInstance);
      return authInstance;
    } catch (e) {
      console.error('[Firebase Init Error]:', e);
    }
  }
  return null;
};

export const app = appInstance;
export const auth = authInstance;
export const db = firestoreInstance;
