import { useState } from 'react';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { entrar } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(''); setEnviando(true);
    try { await entrar(usuario, contrasena); }
    catch (err) {
      const c = err?.code || '';
      if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found') || c.includes('invalid-email')) setError('Usuario o contraseña incorrectos.');
      else if (c.includes('too-many-requests')) setError('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
      else if (c.includes('network')) setError('Sin conexión a internet.');
      else setError(`No se pudo ingresar (${c || 'error desconocido'}).`);
    }
    finally { setEnviando(false); }
  };

  return (
    <div className="login">
      <form className="login-caja" onSubmit={enviar}>
        <div className="logo grande">E</div>
        <h1>Ebptech App</h1>
        <label>Usuario
          <input value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" autoCapitalize="none" required />
        </label>
        <label>Contraseña
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primario" disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </div>
  );
}
