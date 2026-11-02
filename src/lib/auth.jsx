import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, correoDeUsuario } from './firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(undefined); // undefined = cargando
  const [perfil, setPerfil] = useState(null);

  useEffect(() => onAuthStateChanged(auth, setUsuario), []);

  useEffect(() => {
    if (!usuario) { setPerfil(null); return; }
    return onSnapshot(doc(db, 'usuarios', usuario.uid), (s) => setPerfil(s.exists() ? { uid: s.id, ...s.data() } : null));
  }, [usuario]);

  const entrar = (nombreUsuario, contrasena) => signInWithEmailAndPassword(auth, correoDeUsuario(nombreUsuario), contrasena);
  const salir = () => signOut(auth);

  return <AuthCtx.Provider value={{ usuario, perfil, entrar, salir }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
