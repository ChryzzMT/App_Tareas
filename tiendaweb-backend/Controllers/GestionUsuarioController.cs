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
            var usuarios = _gestionuser.listasdeusaurios.Select(u => new Usuario
            {
                Id = u.Id,
                nombre = u.nombre,
                email = u.email
            });
            
            return Ok(usuarios);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al obtener la lista de usuarios");
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
            _gestionuser.CrearUsuario(usuario);
            return CreatedAtAction(nameof(ObtenerUsuario), new { email = usuario.email }, usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al crear el usuario");
        }
    }

    [HttpGet("ObtenerUsuario")]
    public ActionResult<Usuario> ObtenerUsuario([FromQuery] string email, [FromQuery] string password)
    {
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
        {
            return BadRequest("Email y contraseña son requeridos");
        }

        try
        {
            var usuario = new Usuario { email = email, contrasena = password };

            if (!_gestionuser.encontrarUsuario(usuario))
            {
                return NotFound("Usuario no encontrado");
            }
            
            // Don't return the password in the response
            usuario.contrasena = null;
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al obtener el usuario");
        }
    }
}