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

    [HttpPut("Actualizar-Peso")]
    public void ActualizarPeso(int id, int nuevoPeso)
    {
        gestionTareas.ActualizarPesoTarea(id, nuevoPeso);
    }

    [HttpPut("Actualizar-Titulo")]
    public void ActualizarTitulo(string antT, string nuevoT)
    {
        gestionTareas.ActualizarTitulo(antT, nuevoT);
    }

    [HttpDelete("Eliminar-Tarea/{titulo}")]
    public void EliminarTarea(string titulo)
    {
        gestionTareas.EliminarTarea(titulo);
    }


    [HttpPut("Actualizar-descripciondetarea")]
    public void ActualizarDescripcionTarea(int id, string descripcion)
    {
        gestionTareas.ActualizarDescripcion(id, descripcion);
    }

    [HttpPut("Actualizar-fechadeentrega")]
    public void ActualizarFechadeentrega(int idtarea, int year, int mes, int dia, int hora, int minuto)
    {
        gestionTareas.ActualizarFecha(idtarea, year, mes, dia, hora, minuto);
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

    [HttpGet("RecomendacionparaEmpezar")]
    public Tarea Recomendacion()
    {
        return gestionTareas.Recomendacion();
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
}