using Microsoft.AspNetCore.Components.Infrastructure;
using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionTareas
{
    private readonly AppDbContext _db;
    private static int _idenuser;

    public GestionTareas(AppDbContext db)
    {
        _db = db;
        
    }

    public void SetUsuario(int usuario)
    {
        _idenuser = usuario;
    }

    public List<Tarea> ListarTareas()
    {
        return _db.Tareas.Where(p  => p.idUsuario == _idenuser).ToList();
    }

    public void AgregarTarea(Tarea tarea)
    {
        tarea.idUsuario = 1;
        _db.Tareas.Add(tarea);
        _db.SaveChanges();
    }

    public void EliminarTarea(string titu)
    {
        var tarea = _db.Tareas.FirstOrDefault(t => t.Titulo == titu);
        if (tarea != null)
        {
            _db.Tareas.Remove(tarea);
            _db.SaveChanges();
        }
    }

    public void ActualizarTitulo(string antiguoTitulo, string nuevoTitulo)
    {
        var tarea = _db.Tareas.FirstOrDefault(t => t.Titulo == antiguoTitulo);
        if (tarea != null)
        {
            tarea.Titulo = nuevoTitulo;
            _db.SaveChanges();
        }
    }

    public void ActualizarDescripcion(int idTar, string nuevaDescripcion)
    {
        var tarea = _db.Tareas.FirstOrDefault(t => t.IdTarea == idTar);
        if (tarea != null)
        {
            tarea.Descripcion = nuevaDescripcion;
            _db.SaveChanges();
        }
    }

    public void ActualizarPesoTarea(int idTar, int nuevoPeso)
    {
        var tarea = _db.Tareas.FirstOrDefault(t => t.IdTarea== idTar);
        if (tarea != null)
        {
            tarea.PesoTarea = nuevoPeso;
            _db.SaveChanges();
        }
    }

    public void ActualizarFecha(int idTar, int year, int mes, int dia, int hora, int minuto)
    {
        
        var tarea = _db.Tareas.FirstOrDefault(t => t.IdTarea == idTar);
        if (tarea != null)
        {
            tarea.FechaEntrega = new DateTime(year, mes, dia, hora, minuto,0);
            _db.SaveChanges();
        }
    }

    public List<Tarea> MostrarTareasTerminadas()
    {
       var Tareas= _db.Tareas.Where(t =>
           t.idUsuario == _idenuser && (t.Estado.ToLower() == "completada")).ToList();
       
       return Tareas;
    }

    public List<Tarea> MostrarTareasPasadas()
    {
        var tareaspasadas = _db.Tareas.Where(t => t.idUsuario == _idenuser && t.Estado.ToLower() != "completada"
                                                                           && t.FechaEntrega < DateTime.Now);

        return tareaspasadas.OrderByDescending(t => t.FechaEntrega)
            .ToList();
    }

    public List<Object> MostrarPorPrioridad()
    {
        var tareasporprioridad = 
            _db.Tareas.Where(p=>p.idUsuario == _idenuser && 
                                (p.Estado.ToLower() == "pendiente" ||  p.Estado.ToLower() == "enprogreso") &&  p.FechaEntrega > DateTime.Now )
            .OrderByDescending( t => t.Materia.PrioridadMateria).ThenByDescending(m => m.PesoTarea)
            .ThenBy(k => k.FechaEntrega)
            .Select(g => new
        {
            Id = g.IdTarea,
            nombre = g.Titulo,
            descripcion = g.Descripcion,
            estado = g.Estado,
            fechadeentrega = g.FechaEntrega,
            NombreMateria = g.Materia.NombreMateria,
            PesoTarea = g.PesoTarea,
            PesoMateria = g.Materia.PrioridadMateria
           


        });

        return tareasporprioridad.ToList<object>();
    }

    
        public Tarea? Recomendacion()
        {
            var recomendacion = _db.Tareas.Where(p => p.idUsuario == _idenuser &&
                                                      (p.Estado.ToLower() == "pendiente" ||
                                                       p.Estado.ToLower() == "enprogreso") && p.FechaEntrega > DateTime.Now)
                .OrderByDescending(t => t.PesoTarea + t.Materia.PrioridadMateria)
                .ThenBy(k => k.FechaEntrega).FirstOrDefault();
        
            return recomendacion;
        }
}