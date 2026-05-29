using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GestionUsuarioController : ControllerBase
{
    private readonly GestionUsuario _gestionuser;

    public GestionUsuarioController()
    {
        _gestionuser = new GestionUsuario();
    }

    [HttpGet("ListaDeUsuarios")]
    public ActionResult<IEnumerable<Usuario>> ListarUsuario()
    {
        try
        {
            // ✅ Corregido: listasdeusuarios (no listasdeusaurios)
            var usuarios = _gestionuser.listasdeusuarios.Select(u => new Usuario
            {
                Id = u.Id,
                nombre = u.nombre,
                email = u.email
                // No incluir contraseña
            });
            
            return Ok(usuarios);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener la lista de usuarios: {ex.Message}");
        }
    }

    [HttpPost("CrearUsuario")]
    public ActionResult<Usuario> CrearUsuario([FromBody] Usuario usuario)
    {
        if (usuario == null)
        {
            return BadRequest("El usuario no puede ser nulo");
        }

        if (string.IsNullOrEmpty(usuario.email) || string.IsNullOrEmpty(usuario.contrasena))
        {
            return BadRequest("Email y contraseña son requeridos");
        }

        try
        {
            bool creado = _gestionuser.CrearUsuario(usuario);
            
            if (!creado)
            {
                return Conflict("El email ya está registrado");  // HTTP 409 Conflict
            }
            
            // ✅ AHORA SÍ funciona correctamente
            return CreatedAtAction(nameof(ObtenerUsuarioPorEmail), 
                                  new { email = usuario.email }, 
                                  new Usuario 
                                  { 
                                      Id = usuario.Id, 
                                      nombre = usuario.nombre, 
                                      email = usuario.email 
                                  });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al crear el usuario: {ex.Message}");
        }
    }

    // ✅ Nuevo método GET para obtener por email (sin password)
    [HttpGet("PorEmail/{email}")]
    public ActionResult<Usuario> ObtenerUsuarioPorEmail(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("Email es requerido");
        }

        try
        {
            var usuario = _gestionuser.ObtenerUsuarioPorEmail(email);
            
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }
            
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener el usuario: {ex.Message}");
        }
    }

    // Mantienes tu método original de login
    [HttpPost("Login")]
    public ActionResult<Usuario> Login([FromBody] LoginRequest login)
    {
        if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
        {
            return BadRequest("Email y contraseña son requeridos");
        }

        try
        {
            var usuario = _gestionuser.ObtenerUsuarioCompleto(login.Email, login.Password);
            
            if (usuario == null)
            {
                return Unauthorized("Credenciales inválidas");  // HTTP 401
            }
            
            // No devolver la contraseña
            usuario.contrasena = null;
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error en el login: {ex.Message}");
        }
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
