# Tienda Web

Repositorio: https://github.com/daniel04/tiendaweb

## Descripción

Tienda Web es un proyecto académico para el aprendizaje de aplicaciones SPA (Single Page Application) utilizando Angular en el frontend y .NET en el backend.

El objetivo es comprender la integración entre frontend y backend mediante APIs REST, aplicando Programación Orientada a Objetos y formularios Template Driven.

### Frontend

* Angular 21
* Bootstrap
* Routing
* FormsModule
* ngModel (Template Driven Forms)
* HttpClient

### Backend

* .NET 10
* ASP.NET Core Web API
* Controladores REST
* Lógica de negocio separada
* Base de datos simulada mediante listas en memoria

---

# Funcionalidades implementadas

Actualmente el proyecto implementa un CRUD completo de Productos.

La entidad Producto contiene:

* Id
* Nombre
* Descripción
* Precio

Operaciones implementadas:

* Listar productos
* Obtener producto por Id
* Crear producto
* Actualizar producto
* Eliminar producto

---

# Ejecución del proyecto

## Backend

Ingresar a la carpeta del backend y ejecutar:

```bash
dotnet restore
dotnet run
```

## Frontend

Ingresar a la carpeta del frontend y ejecutar:

```bash
npm install
ng serve
```

Abrir en el navegador:

```text
http://localhost:4200
```

---

# Conceptos básicos utilizados en Angular

## Navegación entre páginas

Para navegar entre componentes se utiliza `routerLink`.

Ejemplo:

```html
<button routerLink="/productos">
  Volver al listado
</button>
```

---

## Llamar métodos del componente desde el HTML

Para ejecutar métodos definidos en el componente se utiliza `(click)`.

Ejemplo:

```html
<button (click)="guardar()">
  Guardar
</button>
```

---

## Enlace entre formulario y modelo

El proyecto utiliza Template Driven Forms mediante `FormsModule` y `ngModel`.

Ejemplo:

```html
<input
  type="text"
  class="form-control"
  name="nombre"
  [(ngModel)]="producto.nombre">
```

---

## Mostrar listas de datos

Para recorrer colecciones se utiliza `@for`.

Ejemplo:

```html
@for (producto of productos; track producto.id) {
  <tr>
    <td>{{ producto.nombre }}</td>
  </tr>
}
```

---

## Consumir endpoints desde Angular

Los requests HTTP se realizan directamente desde el componente utilizando `ApiClient`.

Ejemplo:

```typescript
this.api.get<Producto[]>(this.url + '/lista-productos')
  .subscribe({
    next: data => this.productos = data,
    error: error => console.error(error)
  });
```

---

# Cómo agregar un nuevo CRUD

Ejemplo: Categorías.

## Paso 1: Crear la entidad en el backend

Crear la entidad dentro de la carpeta:

```text
Datos/
```

Ejemplo:

```csharp
public class Categoria
{
    public int Id { get; set; }
    public string Nombre { get; set; } = "";
}
```

---

## Paso 2: Crear la lógica de negocio

Crear una nueva clase dentro de:

```text
Negocio/
```

Ejemplo:

```text
GestionCategorias.cs
```

Esta clase será responsable de:

* Simular la base de datos mediante una lista.
* Obtener registros.
* Crear registros.
* Actualizar registros.
* Eliminar registros.

---

## Paso 3: Crear el controlador

Crear un controlador dentro de:

```text
Controllers/
```

Ejemplo:

```text
GestionCategoriasController.cs
```

El controlador debe:

* Instanciar la clase de negocio.
* Exponer los endpoints REST.
* Invocar los métodos de la capa de negocio.

Endpoints sugeridos:

```text
GET    /GestionCategorias/lista-categorias
GET    /GestionCategorias/{id}
POST   /GestionCategorias
PUT    /GestionCategorias/{id}
DELETE /GestionCategorias/{id}
```

---

## Paso 4: Crear la carpeta del CRUD

Dentro de:

```text
src/app/
```

crear la carpeta:

```text
categorias/
```

---

## Paso 5: Crear los componentes

Componente de listado:

```bash
ng generate component categorias/categoria-lista --flat --style none
```

Componente de edición:

```bash
ng generate component categorias/categoria-edicion --flat --style none
```

---

## Paso 6: Crear la interfaz

Crear el archivo:

```text
categoria.ts
```

Ejemplo:

```typescript
export interface Categoria {
  id: number;
  nombre: string;
}
```

---

## Paso 7: Implementar el listado

En:

```text
categoria-lista.ts
```

Implementar:

* Obtención de datos desde el backend.
* Visualización en tabla.
* Eliminación de registros.

Utilizando `ApiClient`.

---

## Paso 8: Implementar la edición

En:

```text
categoria-edicion.ts
```

Implementar:

* Obtención de un registro por Id.
* Creación.
* Actualización.
* Navegación al listado.

Utilizando:

```typescript
FormsModule
```

y

```html
[(ngModel)]
```

---

## Paso 9: Configurar rutas

Agregar las rutas correspondientes en:

```text
app.routes.ts
```

Ejemplo:

```typescript
{
  path: 'categorias',
  component: CategoriaLista
},
{
  path: 'categorias/editar/:id',
  component: CategoriaEdicion
}
```

---

## Paso 10: Agregar acceso desde el menú

Agregar una nueva opción dentro de:

```text
nav-menu.html
```

para acceder al CRUD de Categorías.

---

# Estructura general del proyecto

## Backend

```text
Controllers/
├── GestionProductosController.cs

Datos/
├── Producto.cs

Negocio/
├── GestionProductos.cs

Program.cs
```

## Frontend

```text
core/
└── http/
    └── api-client.ts

nav-menu/
├── nav-menu.ts
└── nav-menu.html

productos/
├── producto.ts
├── producto-lista.ts
├── producto-lista.html
├── producto-edicion.ts
└── producto-edicion.html

categorias/
├── categoria.ts
├── categoria-lista.ts
├── categoria-lista.html
├── categoria-edicion.ts
└── categoria-edicion.html

app.routes.ts
app.config.ts
```

---

# Objetivo académico

Este proyecto tiene fines educativos y busca reforzar los conceptos de:

* Programación Orientada a Objetos
* APIs REST
* Métodos HTTP
* SPA (Single Page Application)
* Componentes Angular
* Routing
* Formularios Template Driven
* Consumo de servicios REST
* Integración Frontend y Backend
