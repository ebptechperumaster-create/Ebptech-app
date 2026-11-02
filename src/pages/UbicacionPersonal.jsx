import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { puede } from '../lib/permisos';

export default function UbicacionPersonal() {
  const { perfil } = useAuth();
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!puede.verRegistrosDelArea(perfil)) return;
    const base = collection(db, 'ubicaciones');
    const q = puede.verTodasLasAreas(perfil) ? base : query(base, where('areas', 'array-contains-any', (perfil.areas || []).slice(0, 10)));
    return onSnapshot(q, (s) => setLista(s.docs.map((d) => ({ id: d.id, ...d.data() }))), (e) => setError(e.message));
  }, [perfil]);

  if (!puede.verRegistrosDelArea(perfil)) return <div className="tarjeta">No tienes acceso a esta vista.</div>;
  return (
    <>
      <h2 className="subtitulo">Personal en turno</h2>
      {error && <p className="error">{error}</p>}
      <ul className="lista-simple">
        {lista.length === 0 && <li className="vacio">Nadie está compartiendo su ubicación ahora.</li>}
        {lista.map((u) => (
          <li key={u.id}>
            <strong>{u.nombre}</strong> · {u.actualizado?.toDate?.().toLocaleTimeString('es-PE', { timeStyle: 'short' }) || '…'}
            <br />
            <a href={`https://maps.google.com/?q=${u.lat},${u.lng}`} target="_blank" rel="noreferrer">Ver en mapa</a>
            <small> ±{u.precision} m</small>
          </li>
        ))}
      </ul>
    </>
  );
}
