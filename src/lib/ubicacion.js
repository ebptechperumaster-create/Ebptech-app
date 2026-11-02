import { useEffect, useRef, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const OPCIONES = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 };

export function obtenerUbicacion() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Este dispositivo no permite obtener la ubicación.'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, precision: Math.round(p.coords.accuracy) }),
      (e) => reject(new Error(e.code === 1 ? 'Debes permitir el acceso a la ubicación para registrar.' : 'No se pudo obtener la ubicación. Intenta de nuevo.')),
      OPCIONES
    );
  });
}

// Mientras el trabajador está "en turno" y la app está abierta, publica su ubicación cada 30 s
// en ubicaciones/{uid}. Alimenta la vista "Ubicación de Personal" de Operaciones.
export function useUbicacionEnVivo(perfil, activo) {
  const [estado, setEstado] = useState(null);
  const ultimo = useRef(0);
  useEffect(() => {
    if (!perfil || !activo || !('geolocation' in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      async (p) => {
        const ahora = Date.now();
        if (ahora - ultimo.current < 30000) return;
        ultimo.current = ahora;
        const datos = { lat: p.coords.latitude, lng: p.coords.longitude, precision: Math.round(p.coords.accuracy) };
        setEstado(datos);
        await setDoc(doc(db, 'ubicaciones', perfil.uid), {
          ...datos, nombre: perfil.nombre, areas: perfil.areas || [], actualizado: serverTimestamp(), enTurno: true
        });
      },
      () => setEstado({ error: true }),
      OPCIONES
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [perfil, activo]);
  return estado;
}

const CLAVE = 'ebptech.enTurno';
export const enTurnoGuardado = () => { try { return localStorage.getItem(CLAVE) === '1'; } catch { return false; } };
export const guardarEnTurno = (v) => { try { localStorage.setItem(CLAVE, v ? '1' : '0'); } catch { /* sin almacenamiento */ } };
