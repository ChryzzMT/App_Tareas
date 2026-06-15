using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionTareasController : Controller
{
    private GestionTareas gestionTareas;

    public GestionTareasController(AppDbContext db)
    {
        gestionTareas = new GestionTareas(db);
    }

    [HttpPost("SETUSUARIO")]
    public void SetUsuario(int usuario)
    {
        gestionTareas.SetUsuario(usuario);
    }

    [HttpGet("Listar-Tareas")]
    public List<Tarea> ListarTareas()
    {
        return gestionTareas.ListarTareas();
    }

    [HttpPost("Crear-Tarea")]
    public void CrearTarea([FromBody] Tarea tarea)
    {
        gestionTareas.AgregarTarea(tarea);
    }
    
    [HttpDelete("Eliminar-Tarea/{titulo}")]
    public void EliminarTarea(string titulo)
    {
        gestionTareas.EliminarTarea(titulo);
    }
    
    [HttpPut("Actualizar-Todo")]
    public void ActualizarTodo([FromBody] Tarea tarea)
    {
        gestionTareas.ActualizarTodo(tarea);
    }

    [HttpGet("MostrarPorPrioridad")]
    public IEnumerable<object> MostrarPorPrioridad()
    {
        return gestionTareas.MostrarPorPrioridad();
    }

    [HttpPut("MarcarCompletado")]
    public void MarcarCompletado(int tareaid)
    {
        gestionTareas.MarcarCompletado(tareaid);
    }

    [HttpGet("ConseguirTareasCompletadas")]
    public List<Tarea> ConseguirTareasCompletadas()
    {
        return gestionTareas.MostrarTareasTerminadas();
    }

    [HttpPut("MarcarVencida")]
    public void MarcarVencida(int tareaid)
    {
        gestionTareas.MarcarVencidad(tareaid);
    }

    [HttpGet("traertareaspasadas")]

    public List<Tarea> Traertareaspasadas()
    {
        return gestionTareas.MostrarTareasPasadas();
    }
}