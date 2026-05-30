using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionTareasController:Controller
{
    private GestionTareas gestionTareas;

    [HttpGet("Listar-Tareas")]
    public IEnumerable<Tarea> ListarTareas()
    {
        return GestionTareas.Tareas;
    }

    [HttpPost("Crear-Tarea")]
    public void CrearTarea([FromBody] Tarea tarea)
    {
        gestionTareas.AgregarTarea(tarea);
    }

    [HttpPut("Actualizar-Peso")]
    public void ActualizarPeso([FromBody] string id, int nuevoPeso)
    {
        gestionTareas.ActualizarPesoTarea(id, nuevoPeso);
    }

    [HttpPut("Actualizar-Titulo")]
    public void ActualizarTitulo([FromBody] string antT, string nuevoT)
    {
        gestionTareas.ActualizarTitulo(antT,nuevoT);
    }

    [HttpDelete("Eliminar-Tarea")]
    public void ActualizarTarea([FromBody] string titulo)
    {
        gestionTareas.EliminarTarea(titulo);
    }

    [HttpPut("Actualizar-descripciondetarea")]
    public void ActualizarDescripcionTarea([FromBody] string id ,  string descripcion)
    {
        gestionTareas.ActualizarDescripcion(id, descripcion);
    }

    [HttpPut("Actualizar-fechadeentrega")]
    public void ActualizarFechadeentrega([FromBody] string idtarea , string fecha )
    {
        gestionTareas.ActualizarFecha(idtarea, fecha);
    }

}