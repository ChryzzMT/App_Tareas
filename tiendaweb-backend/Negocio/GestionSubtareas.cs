using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionSubtareas
{
    private static int userid;
    private AppDbContext _db;

    public GestionSubtareas(AppDbContext context)
    {
        this._db = context;
    }
    
    public void SetUser(int id)
    {
        userid = id;
    }

    public List<Subtarea> ListarSubtareasTarea(int idtarea)
    {
        var result = _db.Subtareas.Include(x=> x.Tarea).Where(x=> x.Tarea.idUsuario == userid && x.idtarea == idtarea).ToList();
        
        return result;
    }

    public void ModificarDescripcionSubtarea(int idSubtarea, string descripcion)
    {
        if(descripcion.DefaultIfEmpty()==null) return;
        var indexsub = _db.Subtareas.Find(idSubtarea);
        indexsub.Descripcion = descripcion;
        _db.Subtareas.Update(indexsub);
        _db.SaveChanges();
    }

    public void EliminarSubtarea(List<int> list)
    {
        if(list.Count == 0) return;

        var lista = _db.Subtareas.Where(t => t.Tarea.idUsuario == userid && list.Contains(t.idsubtarea) ).ToList();
        for (int i = 0; i < lista.Count; i++)
        {
            _db.Subtareas.Remove(lista[i]);
        }
        
        _db.SaveChanges();
    }

    public void EliminarSubtarea(int idSubtarea)
    {
        var indexsub = _db.Subtareas.Find(idSubtarea);
        if (indexsub != null) _db.Subtareas.Remove(indexsub);
        _db.SaveChanges();
    }

    public void CrearSubtarea(int idtarea, string descripcion)
    {
    if(idtarea ==null) return;
    
       Subtarea newSubtarea = new Subtarea();
       newSubtarea.idtarea = idtarea;
       newSubtarea.Descripcion = descripcion;
       _db.Subtareas.Add(newSubtarea);
       _db.SaveChanges();
    }

}