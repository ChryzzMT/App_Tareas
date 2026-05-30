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

    [HttpPost("Actualizar-Peso")]
    public void ActualizarPeso([FromBody] string id, int nuevoPeso)
    {
        gestionTareas.ActualizarPesoTarea(id, nuevoPeso);
    }

    [HttpPost("Actualizar-Titulo")]
    public void ActualizarTitulo([FromBody] string antT, string nuevoT)
    {
        gestionTareas.ActualizarTitulo(antT,nuevoT);
    }

    [HttpPost("Eliminar-Tarea")]
    public void ActualizarTarea([FromBody] string titulo)
    {
        gestionTareas.EliminarTarea(titulo);
    }
    

}