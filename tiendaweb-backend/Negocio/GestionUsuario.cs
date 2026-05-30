using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionUsuario
{
    public static List<Usuario> Listasdeusuarios { get; set; } = new List<Usuario>()
    {
        new() { Id = 1, nombre = "Alain", email = "prueba", contrasena = "prueba123" },
        new() { Id = 2, nombre = "Christian", email = "prueba2", contrasena = "prueba123" }
    }; 
    public int identificador =2;
    
    public void CrearUsuario(Usuario usuario)
    {
        if (usuario == null) return ;
        
        foreach (var existingUser in Listasdeusuarios)
        {
            if (existingUser.email.Equals(usuario.email))
            {
                return ;  
            }
        }

        ++identificador;
        usuario.Id = identificador;
        Listasdeusuarios.Add(usuario);
        
        return ;  
    }

    public void EliminarUsuario(int d)
    {
      
        for (int i = 0; i < Listasdeusuarios.Count; i++)
        {
            if (Listasdeusuarios[i].Id == d)
            {
                Listasdeusuarios.RemoveAt(i);
                return;
            }
        }

       
    }

    public void ModificarUsuario(Usuario usuario)
    {
        if (usuario == null) return;
        int index = Listasdeusuarios.FindIndex(x => x.Id.Equals(usuario.Id));
        Listasdeusuarios[index] = new Usuario
        {
            Id = Listasdeusuarios[index].Id,
            nombre= usuario.nombre,
            email = usuario.email,
            contrasena = usuario.contrasena
        };
        
    }
}

    
    
    
    
    
    
    
    
   
    

