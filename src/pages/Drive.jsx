import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { puede } from '../lib/permisos';
import { AREAS } from '../config/menus';

const listar = httpsCallable(functions, 'driveListar');
const subir = httpsCallable(functions, 'driveSubir');
const CARPETA = 'application/vnd.google-apps.folder';

const aBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = rej;
  r.readAsDataURL(file);
});

export default function Drive() {
  const { perfil } = useAuth();
  const areas = AREAS.filter((a) => a.id !== 'inicio' && puede.verArea(perfil, a.id));
  const [area, setArea] = useState(areas[0]?.id || '');
  const [ruta, setRuta] = useState([]); // [{id, nombre}]
  const [busqueda, setBusqueda] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [estado, setEstado] = useState(null);

  const carpeta = ruta.at(-1)?.id;

  const cargar = async (q = '') => {
    if (!area) return;
    setEstado({ cargando: true });
    try {
      const { data } = await listar({ area, carpetaId: carpeta, busqueda: q });
      setArchivos(data.archivos);
      setEstado(null);
    } catch (e) { setEstado({ error: e.message }); setArchivos([]); }
  };

  useEffect(() => { cargar(); }, [area, carpeta]);

  const subirArchivo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return setEstado({ error: 'El archivo supera 8 MB.' });
    setEstado({ cargando: true });
    try {
      await subir({ area, carpetaId: carpeta, nombre: file.name, mimeType: file.type || 'application/octet-stream', contenido: await aBase64(file) });
      await cargar();
      setEstado({ ok: `${file.name} subido.` });
    } catch (err) { setEstado({ error: err.message }); }
  };

  if (!areas.length) return <div className="tarjeta">No tienes áreas con carpetas asignadas.</div>;

  return (
    <>
      <div className="tarjeta fila">
        <select value={area} onChange={(e) => { setArea(e.target.value); setRuta([]); }}>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); cargar(busqueda); }} className="buscar">
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar archivos" />
        </form>
        <label className="boton primario">Subir<input type="file" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" hidden onChange={subirArchivo} /></label>
      </div>
      <div className="migas">
        <button className="link" onClick={() => setRuta([])}>{AREAS.find((a) => a.id === area)?.nombre}</button>
        {ruta.map((c, i) => <span key={c.id}> › <button className="link" onClick={() => setRuta(ruta.slice(0, i + 1))}>{c.nombre}</button></span>)}
      </div>
      {estado?.cargando && <p>Cargando…</p>}
      {estado?.ok && <p className="ok">{estado.ok}</p>}
      {estado?.error && <p className="error">{estado.error}</p>}
      <ul className="lista-simple">
        {!estado?.cargando && archivos.length === 0 && <li className="vacio">Sin archivos.</li>}
        {archivos.map((f) => (
          <li key={f.id}>
            {f.mimeType === CARPETA
              ? <button className="link" onClick={() => setRuta([...ruta, { id: f.id, nombre: f.name }])}>📁 {f.name}</button>
              : <a href={f.webViewLink} target="_blank" rel="noreferrer">📄 {f.name}</a>}
            <br /><small>{new Date(f.modifiedTime).toLocaleDateString('es-PE')}</small>
          </li>
        ))}
      </ul>
    </>
  );
}
