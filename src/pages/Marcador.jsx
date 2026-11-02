import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { obtenerUbicacion } from '../lib/ubicacion';
import { useTurno } from '../App';

const TIPOS = [
  { id: 'ingreso', nombre: 'Ingreso', turno: true },
  { id: 'inicio_trabajo', nombre: 'Inicio de trabajo', turno: true },
  { id: 'fin_trabajo', nombre: 'Fin de trabajo' },
  { id: 'salida', nombre: 'Salida', turno: false }
];
const NOMBRE = Object.fromEntries(TIPOS.map((t) => [t.id, t.nombre]));

const fecha = (ts) => (ts?.toDate ? ts.toDate() : null)?.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) || '…';

export default function Marcador() {
  const { perfil } = useAuth();
  const { enTurno, setEnTurno, ubicacion } = useTurno();
  const [observacion, setObservacion] = useState('');
  const [estado, setEstado] = useState(null);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'marcaciones'), where('uid', '==', perfil.uid), orderBy('creado', 'desc'), limit(10));
    return onSnapshot(q, (s) => setRegistros(s.docs.map((d) => ({ id: d.id, ...d.data() }))), () => setRegistros([]));
  }, [perfil.uid]);

  const marcar = async (tipo) => {
    setEstado({ cargando: `Obteniendo ubicación para ${tipo.nombre.toLowerCase()}…` });
    try {
      const pos = await obtenerUbicacion();
      await addDoc(collection(db, 'marcaciones'), {
        uid: perfil.uid, nombre: perfil.nombre, areas: perfil.areas || [], tipo: tipo.id,
        ...pos, observacion: observacion.trim(), fechaDispositivo: new Date().toISOString(), creado: serverTimestamp()
      });
      if (tipo.turno !== undefined) setEnTurno(tipo.turno);
      if (tipo.turno === false) await deleteDoc(doc(db, 'ubicaciones', perfil.uid)).catch(() => {});
      setObservacion('');
      setEstado({ ok: `${tipo.nombre} registrado (precisión ${pos.precision} m).` });
    } catch (e) {
      setEstado({ error: e.message });
    }
  };

  return (
    <>
      <div className="migas"><Link to="/area/inicio/MP001">← Volver</Link> <span>Registro de Ingreso</span></div>
      <section className="tarjeta">
        <p className="estado-turno">
          {enTurno ? '● En turno: tu ubicación se comparte cada 30 s mientras la app esté abierta.' : 'Fuera de turno: no se comparte tu ubicación.'}
          {enTurno && ubicacion?.lat && <small> Última: {ubicacion.lat.toFixed(5)}, {ubicacion.lng.toFixed(5)}</small>}
        </p>
        <label>Observación (opcional)
          <input value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Ej.: Planta Solgas Callao" />
        </label>
        <div className="botones-marcar">
          {TIPOS.map((t) => (
            <button key={t.id} className={t.id === 'salida' ? '' : 'primario'} disabled={!!estado?.cargando} onClick={() => marcar(t)}>{t.nombre}</button>
          ))}
        </div>
        {estado?.cargando && <p>{estado.cargando}</p>}
        {estado?.ok && <p className="ok">{estado.ok}</p>}
        {estado?.error && <p className="error">{estado.error}</p>}
      </section>

      <h2 className="subtitulo">Mis últimos registros</h2>
      <ul className="lista-simple">
        {registros.length === 0 && <li className="vacio">Aún no tienes registros.</li>}
        {registros.map((r) => (
          <li key={r.id}>
            <strong>{NOMBRE[r.tipo] || r.tipo}</strong> · {fecha(r.creado)}
            <br />
            <a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer">Ver en mapa</a>
            <small> ±{r.precision} m{r.observacion ? ` · ${r.observacion}` : ''}</small>
          </li>
        ))}
      </ul>
    </>
  );
}
