using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionTareas
{
    private readonly AppDbContext _db;

    public GestionTareas(AppDbContext db)
    {
        _db = db;
    }

    public List<Tarea> ListarTareas()
    {
        return _db.Tareas.ToList();
    }

    public void AgregarTarea(Tarea tarea, int year, int mes, int dia, int hora, int minuto)
    {
        tarea.FechaEntrega = new DateTime(year, mes, dia, hora, minuto, 0);
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
}