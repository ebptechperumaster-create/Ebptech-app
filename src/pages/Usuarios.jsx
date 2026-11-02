import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import CampoContrasena from '../components/CampoContrasena';
import { puede, ROLES, ROL_NOMBRE } from '../lib/permisos';
import { AREAS } from '../config/menus';

const VACIO = { nombre: '', usuario: '', contrasena: '', rol: 'tecnico', areas: ['operaciones'] };

export default function Usuarios() {
  const { perfil } = useAuth();
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!puede.gestionarUsuarios(perfil)) return;
    return onSnapshot(query(collection(db, 'usuarios'), orderBy('nombre')), (s) => setLista(s.docs.map((d) => ({ uid: d.id, ...d.data() }))));
  }, [perfil]);

  if (!puede.gestionarUsuarios(perfil)) return <div className="tarjeta">Solo gerencia o desarrollo pueden gestionar usuarios.</div>;

  const cambiar = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const alternarArea = (id) => setForm({ ...form, areas: form.areas.includes(id) ? form.areas.filter((a) => a !== id) : [...form.areas, id] });

  const crear = async (e) => {
    e.preventDefault(); setMsg(null);
    try {
      await httpsCallable(functions, 'crearUsuario')(form);
      setMsg({ ok: `Usuario ${form.usuario} creado.` }); setForm(VACIO);
    } catch (err) { setMsg({ error: err.message }); }
  };

  const restablecer = async (u) => {
    const contrasena = prompt(`Nueva contraseña para ${u.usuario} (mínimo 8 caracteres):`);
    if (!contrasena) return;
    try { await httpsCallable(functions, 'restablecerContrasena')({ uid: u.uid, contrasena }); setMsg({ ok: `Contraseña de ${u.usuario} actualizada.` }); }
    catch (err) { setMsg({ error: err.message }); }
  };

  return (
    <>
      <form className="tarjeta" onSubmit={crear}>
        <h2>Nuevo usuario</h2>
        <label>Nombre completo<input value={form.nombre} onChange={cambiar('nombre')} required /></label>
        <label>Usuario<input value={form.usuario} onChange={cambiar('usuario')} pattern="[a-zA-Z0-9._\-]{3,30}" title="3 a 30 letras, números, punto o guion" required /></label>
        <label>Contraseña inicial<CampoContrasena value={form.contrasena} onChange={cambiar('contrasena')} minLength={8} required /></label>
        <label>Rol
          <select value={form.rol} onChange={cambiar('rol')}>
            {ROLES.filter((r) => r !== 'desarrollador' || perfil.rol === 'desarrollador').map((r) => <option key={r} value={r}>{ROL_NOMBRE[r]}</option>)}
          </select>
        </label>
        <fieldset><legend>Áreas</legend>
          {AREAS.filter((a) => a.id !== 'inicio').map((a) => (
            <label key={a.id} className="check"><input type="checkbox" checked={form.areas.includes(a.id)} onChange={() => alternarArea(a.id)} /> {a.nombre}</label>
          ))}
        </fieldset>
        {msg?.ok && <p className="ok">{msg.ok}</p>}
        {msg?.error && <p className="error">{msg.error}</p>}
        <button className="primario">Crear usuario</button>
      </form>

      <h2 className="subtitulo">Usuarios ({lista.length})</h2>
      <ul className="lista-simple">
        {lista.map((u) => (
          <li key={u.uid}>
            <strong>{u.nombre}</strong> · {ROL_NOMBRE[u.rol]} · {u.usuario}
            <br /><small>{(u.areas || []).join(', ') || 'sin áreas'}</small>
            <button className="link" onClick={() => restablecer(u)}>Restablecer contraseña</button>
          </li>
        ))}
      </ul>
    </>
  );
}
