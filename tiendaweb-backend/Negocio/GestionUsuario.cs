using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionUsuario
{
    public int identificador { get; set; }
    private readonly AppDbContext _db;

    public GestionUsuario(AppDbContext database)
    {
        _db = database;
    }

    public int CrearUsuario(Usuario usuario)
    {
        _db.Add(usuario);
        _db.SaveChanges();

        return usuario.idUsuario;
    }

    public void EliminarUsuario(int d)
    {
        var usuario = _db.Usuarios.Find(d);

        if (usuario != null)
        {
            _db.Usuarios.Remove(usuario);
            _db.SaveChanges();
        }


    }

    

    public Usuario? Login(string email, string password)
    {
     var usuariolog = _db.Usuarios.FirstOrDefault(e=> e.Email == email && e.Contrasena == password );
     if (usuariolog != null)
     {
         return usuariolog;
     }
     return null;
    }
}

    
    
    
    
    
    
    
    
   
    

