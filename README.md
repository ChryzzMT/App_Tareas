# Gestor de tareas

Aplicación académica de la materia Interacción Humano-Computador.

El frontend es React (Vite + Tailwind). El backend es el API .NET que ya estaba en el repositorio y no se modificó.

## Cómo correrlo

Hacen falta dos terminales.

### Backend (sin cambios)

```bash
cd tiendaweb-backend
dotnet restore
dotnet run
```

El API queda en `http://localhost:5056`.

### Frontend

```bash
cd tiendaweb-frontend
npm install
npm run dev
```

Abrir **http://localhost:4200**.

El puerto es 4200 a propósito: el backend solo acepta peticiones desde ese origen. No hace falta cambiar nada del backend.

Para comprobar que compila:

```bash
npm run build
```

## Qué se puede hacer

Es la misma app de antes, ahora en React:

- Crear cuenta e iniciar sesión.
- Crear, editar, completar y eliminar tareas.
- Ver tareas pendientes, completadas y vencidas.
- Crear, editar y eliminar materias.
- Ver y crear subtareas de una tarea.
- Ver el calendario del mes, con las tareas en su día.
- Ver la matriz de impacto y esfuerzo.

La explicación de carpetas, componentes y heurísticas está en [tiendaweb-frontend/README.md](tiendaweb-frontend/README.md).
