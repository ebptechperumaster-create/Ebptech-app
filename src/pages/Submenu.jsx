import { Link, Navigate, useParams } from 'react-router-dom';
import { MENUS } from '../config/menus';
import { useAuth } from '../lib/auth';
import { puede } from '../lib/permisos';
import ListaMenu from '../components/ListaMenu';
import { destino } from './MenuArea';

export default function Submenu() {
  const { area, menuId } = useParams();
  const { perfil } = useAuth();
  const menu = MENUS[area]?.find((m) => m.id === menuId);
  if (!menu || !puede.verArea(perfil, area)) return <Navigate to="/area/inicio" replace />;
  return (
    <>
      <div className="migas"><Link to={`/area/${area}`}>← Volver</Link> <span>{menu.nombre}</span></div>
      <ListaMenu items={menu.opciones.map((o) => ({ ...o, to: destino(area, o) }))} />
    </>
  );
}
