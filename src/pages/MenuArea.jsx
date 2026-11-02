import { Navigate, useParams } from 'react-router-dom';
import { MENUS } from '../config/menus';
import { useAuth } from '../lib/auth';
import { puede } from '../lib/permisos';
import ListaMenu from '../components/ListaMenu';

export const destino = (area, m) =>
  m.ruta || (m.opciones?.length ? `/area/${area}/${m.id}` : `/proximamente/${encodeURIComponent(m.nombre)}`);

export default function MenuArea() {
  const { area } = useParams();
  const { perfil } = useAuth();
  if (!MENUS[area] || !puede.verArea(perfil, area)) return <Navigate to="/area/inicio" replace />;
  return <ListaMenu items={MENUS[area].map((m) => ({ ...m, to: destino(area, m) }))} />;
}
