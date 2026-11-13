import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Marco from '../components/Marco';
import Campo, { descritoPor } from '../components/Campo';
import { tieneErrores, validarCuenta } from '../logic/validacion';
import { crearCuenta } from '../services/usuarioService';

export default function PaginaRegistro() {
  const navegar = useNavigate();
  const [formulario, setFormulario] = useState({ nombre: '', email: '', contrasena: '' });
  const [errores, setErrores] = useState({});
  const [ocupado, setOcupado] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario((previo) => ({ ...previo, [name]: value }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    const hallados = validarCuenta(formulario);
    setErrores(hallados);
    if (tieneErrores(hallados)) return;
    setOcupado(true);
    try {
      const id = await crearCuenta(formulario);
      if (!id) {
        setErrores({ general: 'No se pudo crear la cuenta. Prueba con otro correo.' });
        return;
      }
      navegar('/login', { state: { cuentaCreada: true } });
    } catch (fallo) {
      setErrores({ general: fallo.message || 'Hubo un fallo de comunicación con el servidor.' });
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Marco titulo="Crear cuenta">
      <section className="panel panel-angosto">
        {errores.general && <p className="error-campo" role="alert">{errores.general}</p>}
        <form className="formulario-columna" onSubmit={enviar} noValidate>
          <Campo id="nombre" etiqueta="Nombre" ayuda="Así te saluda el encabezado." error={errores.nombre}>
            <input
              id="nombre"
              name="nombre"
              autoComplete="name"
              value={formulario.nombre}
              onChange={cambiar}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={descritoPor('nombre', true, errores.nombre)}
            />
          </Campo>
          <Campo id="email" etiqueta="Correo" error={errores.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={formulario.email}
              onChange={cambiar}
              aria-invalid={Boolean(errores.email)}
              aria-describedby={descritoPor('email', false, errores.email)}
            />
          </Campo>
          <Campo id="contrasena" etiqueta="Contraseña" ayuda="Entre 8 y 18 caracteres." error={errores.contrasena}>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={18}
              value={formulario.contrasena}
              onChange={cambiar}
              aria-invalid={Boolean(errores.contrasena)}
              aria-describedby={descritoPor('contrasena', true, errores.contrasena)}
            />
          </Campo>
          <div className="fila-botones">
            <button type="submit" className="boton boton-primario" disabled={ocupado}>
              {ocupado ? 'Creando…' : 'Crear cuenta'}
            </button>
            <Link className="boton boton-secundario" to="/login">Volver a entrar</Link>
          </div>
        </form>
      </section>
    </Marco>
  );
}
