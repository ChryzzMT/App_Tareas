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
            new Usuario {Id = 1 ,nombre = "Alain" , email ="prueba",contrasena ="prueba123"},
            new Usuario{ Id = 2,nombre = "Christian" , email ="prueba2" , contrasena ="prueba123"}
        };
    }
    
    public bool encontrarUsuario(Usuario entrada)
    {
        Usuario usuario = null;
        foreach (var VARIABLE in listasdeusaurios)
        {
            if (VARIABLE.email.Equals(entrada.email) && VARIABLE.contrasena.Equals(entrada.contrasena))
            {
                entrada = VARIABLE;
                
                return true;

            }
        }

        return false;
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

    
    
    
    
    
    
    
    
   
    
}