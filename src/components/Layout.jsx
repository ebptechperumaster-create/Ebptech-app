import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AREAS } from '../config/menus';
import { useAuth } from '../lib/auth';
import { puede, ROL_NOMBRE } from '../lib/permisos';
import { useTurno } from '../App';

export default function Layout() {
  const { perfil, salir } = useAuth();
  const { enTurno } = useTurno();
  const [abierto, setAbierto] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const areas = AREAS.filter((a) => puede.verArea(perfil, a.id));
  const actual = AREAS.find((a) => loc.pathname.startsWith(`/area/${a.id}`) || loc.pathname.startsWith(`/${a.id}/`));
  const titulo = actual?.nombre || (loc.pathname.startsWith('/drive') ? 'Drive' : loc.pathname.startsWith('/usuarios') ? 'Usuarios' : 'Ebptech App');
  const ir = (ruta) => { setAbierto(false); nav(ruta); };

  return (
    <div className="app">
      <header className="barra">
        <button className="icono-btn" aria-label="Menú" onClick={() => setAbierto(true)}>☰</button>
        <div className="logo">E</div>
        <h1>{titulo}</h1>
        {enTurno && <span className="chip-turno" title="Compartiendo ubicación">● En turno</span>}
      </header>

      {abierto && (
        <div className="cajon-fondo" onClick={() => setAbierto(false)}>
          <nav className="cajon" onClick={(e) => e.stopPropagation()}>
            <div className="cajon-perfil">
              <strong>{perfil.nombre}</strong>
              <span>{ROL_NOMBRE[perfil.rol]} · {perfil.usuario}</span>
            </div>
            {areas.map((a) => <button key={a.id} onClick={() => ir(`/area/${a.id}`)}>{a.icono} {a.nombre}</button>)}
            <hr />
            <button onClick={() => ir('/drive')}>📁 Drive</button>
            {puede.gestionarUsuarios(perfil) && <button onClick={() => ir('/usuarios')}>👤 Usuarios</button>}
            <button onClick={salir}>↩ Cerrar sesión</button>
          </nav>
        </div>
      )}

      <main className="contenido"><Outlet /></main>

      <nav className="pestanas">
        {areas.slice(0, 5).map((a) => (
          <NavLink key={a.id} to={`/area/${a.id}`} className={({ isActive }) => (isActive ? 'activa' : '')}>
            <span className="pestana-icono">{a.icono}</span>
            <span>{a.nombre}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
