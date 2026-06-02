using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionTareasController:Controller
{
    private GestionTareas gestionTareas;

    public GestionTareasController()
    {
        gestionTareas = new GestionTareas();
    }

    [HttpGet("Listar-Tareas")]
    public IEnumerable<Tarea> ListarTareas()
    {
        return GestionTareas.Tareas;
    }

    [HttpPost("Crear-Tarea")]
    public void CrearTarea([FromBody] Tarea tarea,int year,int mes, int dia , int hora, int min)
    {
        gestionTareas.AgregarTarea(tarea,year, mes, dia, hora, min);
    }

    [HttpPut("Actualizar-Peso")]
    public void ActualizarPeso(string id, int nuevoPeso)
    {
        gestionTareas.ActualizarPesoTarea(id, nuevoPeso);
    }

    [HttpPut("Actualizar-Titulo")]
    public void ActualizarTitulo(string antT, string nuevoT)
    {
        gestionTareas.ActualizarTitulo(antT,nuevoT);
    }

    [HttpDelete("Eliminar-Tarea")]
    public void ActualizarTarea(string titulo)
    {
        gestionTareas.EliminarTarea(titulo);
    }

    [HttpPut("Actualizar-descripciondetarea")]
    public void ActualizarDescripcionTarea(string id ,  string descripcion)
    {
        gestionTareas.ActualizarDescripcion(id, descripcion);
    }

    [HttpPut("Actualizar-fechadeentrega")]
    public void ActualizarFechadeentrega(string idtarea , string fecha )
    {
        gestionTareas.ActualizarFecha(idtarea, fecha);
    }

}