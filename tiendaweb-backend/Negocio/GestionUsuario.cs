using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionUsuario
{
    public List<Usuario> listasdeusuarios;  // ✅ Corregido typo

    public GestionUsuario()
    {
        listasdeusuarios = new List<Usuario>
        {
            new Usuario { Id = 1, nombre = "Alain", email = "prueba", contrasena = "prueba123" },
            new Usuario { Id = 2, nombre = "Christian", email = "prueba2", contrasena = "prueba123" }
        };
    }
    
    // ✅ Método para validar credenciales
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

    // ✅ Método para obtener usuario por email (útil para CreatedAtAction)
    public Usuario? ObtenerUsuarioPorEmail(string email)
    {
        foreach (var usuario in listasdeusuarios)
        {
            if (usuario.email.Equals(email))
            {
                // Retornar copia sin contraseña
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

    // ✅ Método para obtener usuario completo (solo para validación interna)
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
    
    // ✅ Versión corregida de CrearUsuario
    public bool CrearUsuario(Usuario usuario)
    {
        if (usuario == null) return false;
        
        // ✅ Verificar si el email YA EXISTE (sin importar contraseña)
        foreach (var existingUser in listasdeusuarios)
        {
            if (existingUser.email.Equals(usuario.email))
            {
                return false;  // Email duplicado
            }
        }

        // Asignar nuevo ID
        usuario.Id = listasdeusuarios.Count + 1;
        listasdeusuarios.Add(usuario);
        
        return true;  // Creación exitosa
    }
}

    
    
    
    
    
    
    
    
   
    
}
