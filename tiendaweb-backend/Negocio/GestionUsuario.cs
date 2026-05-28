using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionUsuario
{
    public List<Usuario> listasdeusaurios;

    public GestionUsuario()
    {
        // base de datos para poder ver los usuarios.
        listasdeusaurios = new List<Usuario>
        {
            new Usuario {nombre = "Alain" , email = "prueba",contrasena = "prueba"},
            new Usuario{ nombre = "Christian" , email = "prueba2" , contrasena = "prueba2"}
        };
    }
    
    public Usuario encontrarUsuario(string email, string contrasena)
    {
        Usuario usuario = null;
        foreach (var VARIABLE in listasdeusaurios)
        {
            if (VARIABLE.email.Equals(email) && VARIABLE.contrasena.Equals(contrasena))
            {
                 usuario = VARIABLE;
            }
        }

        return usuario;
    }

    public void CrearUsuario(Usuario usuario)
    {
        if (usuario == null) return;
        foreach (var VARIABLE in listasdeusaurios)
        {
            if (VARIABLE.email.Equals(usuario.email) && VARIABLE.contrasena.Equals(usuario.contrasena))
            {
                return;
            }
        }

        usuario.Id = listasdeusaurios.Count + 1;
        
        listasdeusaurios.Add(usuario);
        
    }

    public bool verificardatospersonales(string email, string contrasena)
    {
        foreach (var VARIABLE in listasdeusaurios)
        {
            if (VARIABLE.email.Equals(email) && VARIABLE.contrasena.Equals(contrasena))
            {
                return true;
            }
        }
        
        return false;
    }
    
    
    
    
    
    
    
   
    
}