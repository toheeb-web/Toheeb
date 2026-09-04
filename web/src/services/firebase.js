// Firebase client initialization for ChopConnect Web
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if valid Firebase configuration was supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "your_firebase_api_key" && 
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your_project_id"
);

let app = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn("Firebase initialization skipped or failed:", error);
  }
}

export { auth };

// Auth Helper Functions
export const firebaseSignIn = async (email, password) => {
  if (!auth) throw new Error("Firebase Auth is not configured. Using local demo session.");
  return await signInWithEmailAndPassword(auth, email, password);
};

export const firebaseRegister = async (email, password) => {
  if (!auth) throw new Error("Firebase Auth is not configured. Using local demo session.");
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const firebaseSignOut = async () => {
  if (!auth) return;
  return await signOut(auth);
};

export const firebaseResetPassword = async (email) => {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  return await sendPasswordResetEmail(auth, email);
};

export const firebaseGoogleSignIn = async () => {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
