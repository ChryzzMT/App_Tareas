using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionUsuario
{
    public List<Usuario> listasdeusuarios { get; }  

    public GestionUsuario()
    {
        listasdeusuarios = new List<Usuario>
        {
            new Usuario { Id = 1, nombre = "Alain", email = "prueba", contrasena = "prueba123" },
            new Usuario { Id = 2, nombre = "Christian", email = "prueba2", contrasena = "prueba123" }
        };
    }
    
    public bool encontrarUsuario(Usuario entrada)
    {
        foreach (var usuario in listasdeusuarios)
        {
            if (usuario.email.Equals(entrada.email) && usuario.contrasena.Equals(entrada.contrasena))
            {
                return true;
            }
        }
        return false;
    }

    public Usuario? ObtenerUsuarioPorEmail(string email)
    {
        foreach (var usuario in listasdeusuarios)
        {
            if (usuario.email.Equals(email))
            {
                return new Usuario 
                { 
                    Id = usuario.Id, 
                    nombre = usuario.nombre, 
                    email = usuario.email 
                };
            }
        }
        return null;
    }

    public Usuario? ObtenerUsuarioCompleto(string email, string contrasena)
    {
        foreach (var usuario in listasdeusuarios)
        {
            if (usuario.email.Equals(email) && usuario.contrasena.Equals(contrasena))
            {
                return usuario;
            }
        }
        return null;
    }
    
    public bool CrearUsuario(Usuario usuario)
    {
        if (usuario == null) return false;
        
        foreach (var existingUser in listasdeusuarios)
        {
            if (existingUser.email.Equals(usuario.email))
            {
                return false;  
            }
        }

        usuario.Id = listasdeusuarios.Count + 1;
        listasdeusuarios.Add(usuario);
        
        return true;  
    }

    public void EliminarUsuario(Usuario usuario)
    {
        if(usuario == null) return;
        if(!encontrarUsuario(usuario)) return;
        int index = listasdeusuarios.FindIndex(x => x.Id.Equals(usuario.Id));
        listasdeusuarios.RemoveAt(index);
    }

    public void ModificarUsuario(Usuario usuario)
    {
        if (usuario == null) return;
        int index = listasdeusuarios.FindIndex(x => x.Id.Equals(usuario.Id));
        listasdeusuarios[index] = usuario;
    }
}

    
    
    
    
    
    
    
    
   
    

