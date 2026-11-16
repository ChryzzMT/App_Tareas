# Frontend React — Gestor de tareas

Misma funcionalidad que el frontend Angular, hecha con el stack del repositorio de referencia de la materia (`gestor-tareas-cato`): **React + Vite + Tailwind**, componentes en `src/components`, datos de apoyo en `src/data`, estado con `useState` / `useEffect` y props para comunicar componentes.

No se usan Redux, React Query, React Router ni TypeScript. La navegación es un `useState` llamado `vista` en `App.jsx`. Las peticiones usan `fetch` (viene en el navegador), en `src/data/api.js`.

## Cómo correrlo

El backend tiene que estar en `http://localhost:5056`.

```bash
cd tiendaweb-frontend
npm install
npm run dev
```

Abrir [http://localhost:4200](http://localhost:4200).

Ese puerto es obligatorio: el CORS del backend ya permite solo `http://localhost:4200`. No se cambia el backend.

```bash
npm run build
```

genera la carpeta `dist` si se quiere comprobar que compila.

## Estructura de carpetas

```text
tiendaweb-frontend/
├── index.html
├── vite.config.js          puerto 4200 y Tailwind
├── package.json
└── src/
    ├── main.jsx            arranca React
    ├── App.jsx             sesión, vista actual y callbacks
    ├── index.css           Tailwind y colores (morado / azul / negro)
    ├── data/
    │   ├── api.js          get, post, put y delete hacia el backend
    │   └── fechas.js       fechas para mostrar y para el input
    └── components/
        ├── Header.jsx
        ├── NavMenu.jsx
        ├── Footer.jsx
        ├── Alert.jsx
        ├── EmptyState.jsx
        ├── ConfirmDialog.jsx
        ├── LoginForm.jsx
        ├── RegisterForm.jsx
        ├── TaskList.jsx
        ├── TaskCard.jsx
        ├── TaskForm.jsx
        ├── MateriaList.jsx
        ├── MateriaCard.jsx
        ├── MateriaForm.jsx
        ├── SubtaskList.jsx
        ├── SubtaskCard.jsx
        ├── SubtaskForm.jsx
        ├── CalendarView.jsx
        ├── MatrixView.jsx
        └── Quadrant.jsx
```

`App` guarda lo que comparten las pantallas (quién inició sesión y qué pantalla se ve) y se lo pasa a los hijos por props. Cada pantalla pide sus datos al backend y se los pasa a las tarjetas.

## Contenidos de la materia

1. **Heurísticas de Nielsen.** Ver la tabla de abajo.
2. **Componentes reutilizables.** `TaskCard`, `MateriaCard`, `SubtaskCard`, `Alert`, `EmptyState`, `ConfirmDialog` y `Quadrant` se usan en más de un caso o están pensados para reutilizarse. La matriz pinta cuatro veces el mismo `Quadrant`.
3. **Props.** El padre pasa datos y funciones. Ejemplos: `TaskCard` recibe `tarea`, `nombreMateria`, `textoCompletar`, `onEdit`, `onDelete`, `onComplete` y `onOpenSubtasks`. `ConfirmDialog` recibe `titulo`, `mensaje`, `onConfirm` y `onCancel`. `NavMenu` recibe `vista`, `user`, `onNavigate` y `onLogout`.
4. **Tailwind.** Todas las pantallas se estilan con clases de Tailwind. Los colores de la interfaz (fondo `#0b0b0f`, morado `#6D4AFF` y azul `#1EA7FD`) están en `src/index.css` con `@theme`.
5. **Estado.** `useState` en `App` (vista, usuario, tarea o materia que se está editando). `useState` en cada formulario y en cada listado. `useEffect` para cargar datos cuando cambia el usuario o el mes. El aviso de “cuenta creada” o “tarea guardada” sube al padre y baja otra vez como prop `aviso`.
6. **Validación.** `LoginForm` (correo y contraseña obligatorios, formato de correo). `RegisterForm` (nombre 2–40, correo, contraseña 8–18). `TaskForm` (título 3–80, descripción 3–200, peso de la lista, fecha y materia). `MateriaForm` (nombre 2–60, prioridad 1–10). `SubtaskForm` (descripción 3–150). El mensaje queda visible en `Alert`.
7. **Confirmar antes de eliminar.** `TaskCard`, `MateriaCard` y `SubtaskCard` abren `ConfirmDialog`. Cancelar cierra el diálogo y no llama al backend. En tareas y materias el texto avisa que también se borran los datos relacionados, porque así funciona el API.
8. **Carpetas.** Igual que la referencia: componentes en `src/components` y el acceso a datos en `src/data`.

## Heurísticas y dónde están

| Heurística | Dónde |
| --- | --- |
| Visibilidad del estado del sistema | Textos “Cargando…”, “Guardando…”, “Actualizando…”. `Alert` de éxito o error. El botón de la sección activa en `NavMenu`. El día de hoy resaltado en el calendario. “Hola, nombre” en el encabezado. |
| Correspondencia con el mundo real | Textos en español: pendientes, vencidas, prioridad 1 a 10, peso como esfuerzo. |
| Control y libertad del usuario | Cancelar en los formularios, “Volver a tareas”, mes anterior / siguiente, cerrar sesión, y Cancelar en el diálogo de borrado. |
| Consistencia | Mismas tarjetas, mismos botones (morado = acción principal, rojo = eliminar, azul = enlace) y el mismo `Alert` en todas las pantallas. |
| Prevención de errores | Confirmación al eliminar. “Vencida” no se puede elegir a mano. Al editar una materia el nombre queda de solo lectura, porque el API la busca por nombre. Si no hay materias, la tarea no se guarda y se ofrece ir a crear una. |
| Reconocer en vez de recordar | El menú muestra las secciones. Las etiquetas dicen el tamaño permitido (“3 a 80 caracteres”). |
| Flexibilidad | Atajos no hacen falta en este alcance; sí hay una vía clara para cada acción (crear, editar, volver). |
| Diseño estético y minimalista | Una tarea por tarjeta, tres grupos, matriz de cuatro cuadrantes. Sin información de más. |
| Recuperación ante errores | Mensajes concretos (“El correo o la contraseña son incorrectos”, “La contraseña debe tener entre 8 y 18 caracteres”) y, si el backend no responde, se indica el puerto 5056. |
| Ayuda y documentación | Pistas cortas bajo prioridad, peso y estado. Este README. |

## API que consume

La base es `http://localhost:5056`. Los endpoints son los que ya existen, por ejemplo:

- `GET /GestionUsuario/VerificarUsuario`
- `POST /GestionUsuario/CrearUsuario`
- `GET/POST/PUT/DELETE` de `GestionTareas`, `GestionMaterias`, `GestionSubtarea`, `GestionCalendario` y `GestionImpactoEsfuerzo`

El usuario activo se guarda en `localStorage` (`usuarioId`, `usuarioNombre`). Cada pantalla vuelve a enviar ese id al backend antes de leer, porque el API lo guarda en memoria.
