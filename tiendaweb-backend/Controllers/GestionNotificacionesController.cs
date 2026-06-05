using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]

public class GestionNotificacionesController : Controller
{
    private GestionNotificaciones gestionNotificaciones;

    public GestionNotificacionesController(AppDbContext db)
    {
        gestionNotificaciones = new GestionNotificaciones(db);
    }
    
    [HttpGet("listarNotificaciones")]
    public void ListarNotificaciones(int idUsuario)
    {
        gestionNotificaciones.ListarNotificaciones(idUsuario);
    }
    
    [HttpPost("CrearNotificacion")]
    public void CrearNotificacion(int idTarea, int idUsuario)
    {
        gestionNotificaciones.CrearNotificacion(idTarea, idUsuario);
    }
    
    [HttpPost("EnviarNotificacion")]
    public async Task<IActionResult> EnviarNotificaciones()
    {
        await gestionNotificaciones.EnviarNotificaciones();
        return Ok("Notificaciones enviadas");
    }
}