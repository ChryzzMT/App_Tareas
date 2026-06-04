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
        gestionTareas = new GestionTareas(db );
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
    public void CrearTarea([FromBody] Tarea tarea,int year, int mes, int dia, int hora, int minuto)
    {
        gestionTareas.AgregarTarea(tarea,year, mes, dia, hora, minuto);
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

    [HttpDelete("Eliminar-Tarea")]
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
}