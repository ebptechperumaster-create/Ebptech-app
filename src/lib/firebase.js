import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const env = import.meta.env;
const usarEmuladores = env.VITE_USE_EMULATORS === 'true' || !env.VITE_FIREBASE_API_KEY;

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-ebptech.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'demo-ebptech',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'southamerica-east1');

if (usarEmuladores) {
  const host = location.hostname;
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
  connectFunctionsEmulator(functions, host, 5001);
}

// Los usuarios entran con "usuario"; Firebase necesita un correo, así que se arma uno interno.
export const DOMINIO_USUARIOS = 'usuarios.ebptech.app';
export const correoDeUsuario = (usuario) => `${usuario.trim().toLowerCase()}@${DOMINIO_USUARIOS}`;
