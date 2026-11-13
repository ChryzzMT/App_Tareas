import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Marco from '../components/Marco';
import Campo, { descritoPor } from '../components/Campo';
import { useSesion } from '../hooks/useSesion';
import { tieneErrores, validarAcceso } from '../logic/validacion';
import { iniciarSesion } from '../services/usuarioService';

export default function PaginaAcceso() {
  const { usuarioId, nombre, iniciar } = useSesion();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [formulario, setFormulario] = useState({ email: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [ocupado, setOcupado] = useState(false);
  const cuentaCreada = ubicacion.state?.cuentaCreada;
  const aviso = ubicacion.state?.aviso;

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario((previo) => ({ ...previo, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const hallados = validarAcceso(formulario);
    setErrores(hallados);
    if (tieneErrores(hallados)) return;
    setOcupado(true);
    try {
      const usuario = await iniciarSesion(formulario.email.trim(), formulario.contrasena);
      if (!usuario?.idUsuario) {
        setErrores({ general: 'El correo o la contraseña no coinciden. Revísalos o crea una cuenta.' });
        return;
      }
      iniciar(usuario);
      navegar('/tareas');
    } catch (fallo) {
      setErrores({ general: fallo.message || 'Hubo un fallo de comunicación con el servidor.' });
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Marco titulo="Entrar">
      <section className="panel panel-angosto">
        {cuentaCreada && (
          <p className="aviso-linea" role="status">
            Tu cuenta fue creada. Entra con el correo y la contraseña que acabas de elegir.
          </p>
        )}
        {aviso && <p className="aviso-linea" role="status">{aviso}</p>}
        {usuarioId && (
          <p className="ayuda">
            Ya hay una sesión de {nombre || 'tu cuenta'}.{' '}
            <Link to="/tareas">Ir a las tareas</Link>
          </p>
        )}
        {errores.general && <p className="error-campo" role="alert">{errores.general}</p>}
        <form className="formulario-columna" onSubmit={enviar} noValidate>
          <Campo id="email" etiqueta="Correo" ayuda="El mismo con el que creaste la cuenta." error={errores.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={formulario.email}
              onChange={cambiar}
              aria-describedby={descritoPor('email', true, errores.email)}
            />
          </Campo>
          <Campo id="contrasena" etiqueta="Contraseña" error={errores.contrasena}>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              value={formulario.contrasena}
              onChange={cambiar}
              aria-invalid={Boolean(errores.general)}
              aria-describedby={descritoPor('contrasena', false, errores.contrasena)}
            />
          </Campo>
          <button type="submit" className="boton boton-primario" disabled={ocupado}>
            {ocupado ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="ayuda">
          ¿No tienes cuenta? <Link to="/registro">Crear una cuenta</Link>
        </p>
      </section>
    </Marco>
  );
}
