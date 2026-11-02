import { createContext, useContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './lib/auth';
import { enTurnoGuardado, guardarEnTurno, useUbicacionEnVivo } from './lib/ubicacion';
import Layout from './components/Layout';
import Login from './pages/Login';
import MenuArea from './pages/MenuArea';
import Submenu from './pages/Submenu';
import Marcador from './pages/Marcador';
import Usuarios from './pages/Usuarios';
import Drive from './pages/Drive';
import UbicacionPersonal from './pages/UbicacionPersonal';
import Proximamente from './pages/Proximamente';

const TurnoCtx = createContext(null);
export const useTurno = () => useContext(TurnoCtx);

export default function App() {
  const { usuario, perfil } = useAuth();
  const [enTurno, setEnTurnoState] = useState(enTurnoGuardado);
  const setEnTurno = (v) => { guardarEnTurno(v); setEnTurnoState(v); };
  const ubicacion = useUbicacionEnVivo(perfil, enTurno);

  if (usuario === undefined) return <div className="cargando">Cargando…</div>;
  if (!usuario) return <Login />;
  if (!perfil) return <div className="cargando">Tu usuario no tiene un perfil asignado. Pide a gerencia que lo configure.</div>;

  return (
    <TurnoCtx.Provider value={{ enTurno, setEnTurno, ubicacion }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/area/inicio" replace />} />
          <Route path="/area/:area" element={<MenuArea />} />
          <Route path="/area/:area/:menuId" element={<Submenu />} />
          <Route path="/inicio/marcador" element={<Marcador />} />
          <Route path="/operaciones/ubicacion" element={<UbicacionPersonal />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/proximamente/:nombre" element={<Proximamente />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </TurnoCtx.Provider>
  );
}
