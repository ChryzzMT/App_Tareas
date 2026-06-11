using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionMaterias
{
    private readonly AppDbContext _db;
    private static int user;
    public GestionMaterias(AppDbContext db)
    {
        _db = db;
    }

    public void SetUser(int user)
    {
        GestionMaterias.user = user;
    }

    public List<Materia> ListaMaterias()
    {
        return _db.Materias.Where(p => p.IdUsuario == user).ToList();
    }
    public void AgregarMateria(Materia mat)
    {
        mat.IdUsuario = user;
        _db.Materias.Add(mat);
        _db.SaveChanges();
    }
    
    public void ActualizarPesoMateria(Materia mat)
    {
        foreach (var m in _db.Materias)
        {
            if (m.NombreMateria == mat.NombreMateria && m.IdUsuario == mat.IdUsuario)
            {
                m.PrioridadMateria = mat.PrioridadMateria;
            }
        }

        _db.SaveChanges();
    }

    public void EliminarMateria(string nombre)
    {
        var materia = _db.Materias.FirstOrDefault(m => m.NombreMateria == nombre && m.IdUsuario == user);
        var tareas = _db.Tareas.ToList();
        GestionTareas gestionTareas = new GestionTareas(_db);
        gestionTareas.SetUsuario(user);
        for (int i = 0; i < tareas.Count; i++)
        {
            if (materia.IdMateria == tareas[i].idMateria)
            {
                gestionTareas.EliminarTarea(tareas[i].Titulo);
            }
        }
        
        if (materia != null)
        {
            _db.Materias.Remove(materia);
            _db.SaveChanges();
        }
    }
}