import { useState } from 'react';

// Campo de contraseña con botón para mostrar u ocultar lo escrito.
export default function CampoContrasena(props) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="campo-contrasena">
      <input {...props} type={visible ? 'text' : 'password'} autoCorrect="off" autoCapitalize="none" spellCheck={false} />
      <button
        type="button"
        className="ojo"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        title={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? 'Ocultar' : 'Ver'}
      </button>
    </span>
  );
}
