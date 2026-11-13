# Sistema de Priorización de Tareas

Aplicación académica de la materia Interacción Humano-Computador. Ayuda a ordenar entregas universitarias según dos datos del mundo real: **qué tan importante es la materia** (de 1 a 10) y **cuánto esfuerzo pide la tarea** (el peso: 1, 2, 3, 5, 8 o 13).

El cliente está en React. El servidor sigue siendo la API ASP.NET Core que ya existía.

## Qué había realmente en el repositorio

El README anterior describía una tienda de productos (nombre, descripción y precio). El código no era eso. La aplicación real, visible en `tiendaweb-frontend/src/app` y en `tiendaweb-backend`, es un sistema de tareas académicas:

- cuentas de usuario
- materias con prioridad
- tareas con peso, fecha y estado (Pendiente, Activa, Completada, Vencida)
- subtareas
- calendario mensual
- matriz de impacto y esfuerzo

Esa matriz es la regla de priorización y se conservó. Los nombres de carpeta `tiendaweb` se dejaron porque el backend ya estaba publicado con ese espacio de nombres.

## Cómo ejecutarlo

Hace falta Node.js 22 y el SDK de .NET 10.

### Backend

En la red de la cátedra, la API usa SQL Server (la cadena sigue en `tiendaweb-backend/appsettings.json`):

```bash
cd tiendaweb-backend
dotnet run
```

La API queda en `http://localhost:5056`.

Fuera de esa red el servidor no responde. Para probar la misma lógica en un archivo local:

```bash
cd tiendaweb-backend
USE_SQLITE=1 dotnet run
```

Eso crea `priorizacion-local.db` junto al proyecto. No cambia los controladores ni las reglas. Sin la variable, el programa sigue intentando SQL Server.

### Frontend

```bash
cd tiendaweb-frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. La primera pantalla es el ingreso. Desde ahí se puede crear una cuenta.

Otros comandos:

```bash
npm test        # Vitest: reglas de prioridad y flujo crear/editar/eliminar
npm run build   # compilación de producción
npm run preview # sirve la carpeta dist en el puerto 4173
```

Si el backend no está en el puerto 5056, define `VITE_API_URL` antes de `npm run dev`.

## Arquitectura

Hay dos procesos. El navegador no guarda las tareas: cada alta, edición, borrado y cambio de estado llama a la API. `localStorage` solo recuerda quién inició sesión (`usuarioId` y `usuarioNombre`), igual que el cliente Angular.

```text
tiendaweb-frontend/src
├── assets/          marca del sistema
├── components/      piezas de interfaz
├── context/         sesión, tareas y avisos compartidos
├── hooks/           acceso a ese estado y atajos de teclado
├── logic/           prioridad, validación, filtros y calendario
├── models/          forma de los datos (JSDoc)
├── pages/           pantallas y rutas
├── services/        cliente HTTP, un archivo por recurso
├── styles/          CSS propio
└── test/            Vitest y Testing Library
```

`App.jsx` solo arma los proveedores y las rutas. La lógica de prioridad que se muestra en cada tarjeta está en `src/logic/priorizacion.js` y repite, para poder explicarla y probarla, lo que calcula `GestionImpactoEsfuerzo` en el servidor. La matriz de la pantalla Matriz sale del endpoint: el servidor sigue siendo la autoridad.

### Regla de prioridad

Entran solo las tareas abiertas cuya entrega es posterior al inicio de hoy. Completadas y vencidas quedan fuera.

| Grupo | Cuándo entra | Cómo se reconoce, además del color |
| --- | --- | --- |
| Oportunidades | Materia 8–10 y peso 1, 2 o 3 | Rombo y texto |
| Ganancia rápida | Peso 5, 8 o 13 y materia 4 o más | Triángulo y texto |
| Menor ganancia | Materia 4–7 y peso 2 o 3 | Cuadrado y texto |
| Descartar | El resto de las tareas abiertas | Círculo punteado y texto. En el código original este grupo es la mínima ganancia |

El listado pendiente sigue ordenado por fecha de entrega, como `ListarTareas`. Ordenar por importancia del cuadrante es una vista extra y no reemplaza esa regla.

Al marcar como hecha una tarea completada o vencida, el servidor la devuelve a Pendiente y mueve la entrega cinco días. El cliente no inventa esa fecha: vuelve a leer la API y lo explica en el aviso.

## Decisiones

- **JavaScript, no TypeScript.** El gestor usado como referencia (`gestor-tareas-cato`) es React + Vite en JSX. Este proyecto sigue ese stack. Los estilos son CSS, no Tailwind: la consigna pedía CSS y la identidad visual es propia (papel, tinta y terracota, no la plantilla gris y azul de la referencia).
- **De la referencia se tomó la estructura de pantalla**, no el dominio. Encabezado con el nombre del sistema, formulario arriba, tarjetas, estado vacío y pie. No hay docente ni tareas de ejemplo fijas: los datos salen de la API.
- **React Router sí hace falta.** Login, registro, tareas, matriz, calendario y materias son pantallas distintas.
- **CORS.** `Program.cs` acepta el puerto 4200 de Angular y los puertos 5173 y 4173 de Vite. El resto del backend no se reescribió.
- **SQLite opcional.** Solo con `USE_SQLITE=1`, para poder ejecutar fuera de la red de la cátedra. La cadena de SQL Server queda como camino por defecto.
- **No hay un arrastre entre cuadrantes.** El endpoint `CambiarCuadrantes` existe, pero la pantalla Angular nunca lo usaba y el movimiento no se guarda: al recalcular, la tarea vuelve a su grupo. Para cambiar de grupo se edita el peso o la prioridad de la materia.
- **Subtareas.** El cliente Angular pedía `DeleteListaSubtareas`, una ruta que el controlador no tiene. El cliente React llama a `DeleteSubtarea`, que sí existe. También se puede corregir el texto, porque `ActualizarDescripcion` ya estaba en la API.
- **Vencidas primero.** Al cargar, el cliente pide antes `traertareaspasadas`. Ese endpoint es el que marca como vencidas las pendientes con fecha pasada. Después pide el resto, para no mostrarlas todavía como pendientes.
- **Tareas que no caían en ninguna lista.** Una tarea Activa con fecha ya pasada no era pendiente ni vencida. `MostrarPorPrioridad` permite verlas en «Tareas por revisar».
- `Notificacion` y `Semestre` están en el modelo del servidor y no tienen pantalla ni controlador de uso. No se inventó una bandeja de avisos del servidor. Los avisos de la interfaz son la confirmación de lo que el usuario acaba de hacer.

## Heurísticas de Nielsen

| Heurística | Dónde se nota |
| --- | --- |
| 1. Visibilidad del estado | `components/Avisos.jsx` confirma crear, editar, eliminar y completar. `components/Cargando.jsx` muestra la espera. El botón de guardar pasa a «Guardando…». |
| 2. Lenguaje del mundo real | Textos de materias, entregas y esfuerzo. `components/AyudaPrioridad.jsx` explica la regla sin nombres de clases ni de endpoints. |
| 3. Control y libertad | «Cancelar» y «Limpiar» en `components/FormularioTarea.jsx`. «Cerrar» en `components/Cortina.jsx`. «Deshacer» tras borrar una tarea, en `context/TareasContext.jsx`. |
| 4. Consistencia | Los mismos botones, bordes y avisos salen de `styles/componentes.css`. Prioridad y estado usan siempre `IndicadorPrioridad.jsx` e `IndicadorEstado.jsx`. |
| 5. Prevención de errores | `logic/validacion.js` impide guardar una tarea o una materia incompletas. `components/DialogoConfirmacion.jsx` pide confirmación antes de eliminar. La opción Vencida no se puede elegir: la pone el sistema. |
| 6. Reconocimiento antes que recuerdo | `components/TarjetaTarea.jsx` muestra título, descripción, materia, prioridad de la materia, peso, fecha, estado y cuadrante. |
| 7. Flexibilidad | `components/BarraFiltros.jsx` busca, filtra y ordena. Pulsar una cifra de `components/ResumenEstadisticas.jsx` aplica ese filtro. `hooks/useAtajos.js`: `/` busca, `N` va al título, Escape cierra. |
| 8. Estética y jerarquía | Poco ruido, una acción primaria terracota y el borde de la tarjeta distinto según el cuadrante. Lo urgente se lee por la forma y la palabra, no solo por el color. |
| 9. Errores que dicen cómo seguir | Cada campo inválido explica la corrección en `logic/validacion.js`. Si el servidor no responde, `services/apiClient.js` dice que hay que abrirlo en el puerto 5056. El banner de las páginas tiene «Reintentar». |
| 10. Ayuda breve | Los párrafos `.ayuda` de los formularios y el desplegable «¿Cómo se decide qué va primero?». El cuadrante también tiene un `title` con su explicación. |

Accesibilidad: etiquetas unidas a los campos en `components/Campo.jsx`, diálogo con `aria-modal`, enlace «Saltar al contenido» en `components/Marco.jsx`, foco visible en `styles/global.css`, y la prioridad distinguida por forma y texto. La disposición pasa a una columna por debajo de 800 px.

## Comunicación entre componentes

El estado de las tareas no se copia en cada pantalla. Vive en `TareasContext` y las páginas lo leen con `useTareas`.

| Dirección | Ejemplo | Dónde |
| --- | --- | --- |
| Props, padre → hijo | La página entrega la tarea, las materias y las acciones a cada tarjeta | `pages/PaginaTareas.jsx` línea 129 pasa `onEditar` a `SeccionTareas`, que a su vez arma `TarjetaTarea` |
| Callback, hijo → padre | El formulario no llama a la API. Avisa con `onGuardar` y la página decide si crea o actualiza | `components/FormularioTarea.jsx` línea 68 |
| Callback de filtros | La barra no guarda el filtro. Llama a `onCambiar` y la página actualiza su `useState` | `components/BarraFiltros.jsx` línea 6 y `pages/PaginaTareas.jsx` línea 103 |
| `useState` | Campos del formulario, filtros, tarea en edición y diálogo de borrado | `components/FormularioTarea.jsx` línea 25 y `pages/PaginaTareas.jsx` línea 34 |
| `useEffect` | Al abrir una tarea en edición, el formulario copia sus datos. Al abrir subtareas, se piden a la API. Al cambiar de cuenta, se recargan las listas | `components/FormularioTarea.jsx` línea 37, `components/PanelSubtareas.jsx` línea 38, `context/TareasContext.jsx` línea 96 |
| `useEffect` y `localStorage` | La sesión se rehidrata y se vuelve a guardar | `context/SesionContext.jsx` líneas 8 y 14 |
| Context | Una sola lista de tareas, materias, carga y error para Tareas, Matriz, Calendario y Materias | `context/TareasContext.jsx` línea 35, montado en `App.jsx` línea 18 |
| Callback de la tarjeta | «Editar», «Eliminar», «Subtareas» y «Marcar como hecha» suben el hecho al padre | `components/TarjetaTarea.jsx` línea 47 |

## Qué se migró

| En Angular | En React |
| --- | --- |
| Componentes (`tareas.ts`, `tarea-edicion.ts`, `lista-materias.ts`, …) | Componentes funcionales en `components/` y pantallas en `pages/` |
| Datos que el padre pasaba al template | Props |
| `(click)` y navegación con estado | Callbacks (`onGuardar`, `onEditar`, `onCambiar`) |
| `ApiClient` (`core/http/api-client.ts`) | `services/apiClient.js` y un servicio por recurso |
| `ngOnInit` | `useEffect` |
| `[(ngModel)]` y `FormsModule` | Formularios controlados con `useState` |
| `@for` y `@if` | `map`, `filter` y renderizado condicional |
| `app.routes.ts` | `react-router-dom` en `App.jsx` |
| Variables de cada componente y `localStorage` suelto | `TareasContext` y `SesionContext` |
| Bootstrap | `styles/global.css` y `styles/componentes.css` |
| Lógica de cuadrantes solo en C# | La misma regla, legible y probada, en `logic/priorizacion.js`; el cálculo de la matriz sigue en el servidor |

## Pruebas

`npm test` cubre la clasificación (oportunidades, ganancia rápida, menor ganancia, descartar, tareas que no entran), el regreso a pendiente a los cinco días, la validación y el flujo de crear, editar, cancelar el borrado y eliminar.

`npm run build` genera `tiendaweb-frontend/dist` sin avisos de compilación.
