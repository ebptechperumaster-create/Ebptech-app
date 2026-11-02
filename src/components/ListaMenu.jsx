import { Link } from 'react-router-dom';

export default function ListaMenu({ items }) {
  return (
    <ul className="lista-menu">
      {items.map((it) => (
        <li key={it.id}>
          <Link to={it.to}>
            <span className="circulo">{it.icono || it.nombre.charAt(0)}</span>
            <span className="lista-texto">{it.nombre}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
