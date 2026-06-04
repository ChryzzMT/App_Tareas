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
                m.PesoMateria = mat.PesoMateria;
            }
        }

        _db.SaveChanges();
    }
    
    public void EliminarMaterias(List<string> nombres)
    {
        for (int i = 0; i < nombres.Count; i++)
        {
            for (int j = 0; j < _db.Materias.ToList().Count; j++)
            {
                if (_db.Materias.ToList()[j].NombreMateria == nombres[i] && _db.Materias.ToList()[j].IdUsuario == user)
                {
                    _db.Materias.ToList().RemoveAt(j);
                }
            }
        }
        _db.SaveChanges();
    }
}