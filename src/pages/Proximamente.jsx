import { useNavigate, useParams } from 'react-router-dom';

export default function Proximamente() {
  const { nombre } = useParams();
  const nav = useNavigate();
  return (
    <div className="tarjeta centro">
      <h2>{decodeURIComponent(nombre)}</h2>
      <p>Este formulario se construye en el paso 3 del plan.</p>
      <button onClick={() => nav(-1)}>← Volver</button>
    </div>
  );
}
