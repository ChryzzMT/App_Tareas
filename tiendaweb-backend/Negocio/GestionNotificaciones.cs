using Microsoft.AspNetCore.Components.Infrastructure;
using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Servicios;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionNotificaciones
{
    private readonly AppDbContext _db;

    public GestionNotificaciones(AppDbContext db)
    {
        _db = db;
    }
    
    public List<Notificacion> ListarNotificaciones(int idUsuario)
    {
        return _db.Notificaciones.Include(n => n.Tarea).Where(n => n.IdUsuario == idUsuario).ToList();
    }

    public void CrearNotificacion(int idTarea, int idUsuario)
    {
        Notificacion notificacion = new Notificacion
        {
            IdTarea = idTarea,
            IdUsuario = idUsuario,
        };

        _db.Notificaciones.Add(notificacion);
        _db.SaveChanges();
    }
    
    public async Task EnviarNotificaciones()
    {
        var en24horas = DateTime.Now.AddHours(24);

        var pendientes = _db.Notificaciones.Include(n => n.Tarea)
            .Include(n => n.Usuario)
            .Where(n => n.Tarea.FechaEntrega <= en24horas && n.Tarea.FechaEntrega >= DateTime.Now)
            .ToList();

        EmailService emailService = new EmailService();

        foreach (var notificacion in pendientes)
        {
            await emailService.EnviarEmail(
                notificacion.Usuario.Email,
                notificacion.Tarea.Titulo,
                notificacion.Tarea.FechaEntrega.Value
            );
        }
    }

    public void eliminarNotificacion(int idTarea)
    {

        _db.Notificaciones.ToList();
    }
    
}