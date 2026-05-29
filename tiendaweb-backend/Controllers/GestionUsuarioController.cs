using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GestionUsuarioController : ControllerBase
{
    private readonly IGestionUsuario _gestionuser;

    
    public GestionUsuarioController(IGestionUsuario gestionuser)
    {
        _gestionuser = gestionuser;
    }

    [HttpGet("ListaDeUsuarios")]
    public ActionResult<IEnumerable<Usuario>> ListarUsuario()
    {
        try
        {
            var usuarios = _gestionuser.listasdeusuarios.Select(u => new Usuario
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
            var usuarioCreado = _gestionuser.CrearUsuario(usuario);
            return CreatedAtAction(nameof(ObtenerUsuario), new { email = usuario.email }, usuarioCreado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al crear el usuario");
        }
    }

    [HttpPost("ObtenerUsuario")] 
    public ActionResult<Usuario> ObtenerUsuario([FromBody] LoginRequest login)
    {
        if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
        {
            return BadRequest("Email y contraseña son requeridos");
        }

        try
        {
            var usuario = _gestionuser.ObtenerUsuarioPorCredenciales(login.Email, login.Password);
            
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }
            
            
            usuario.contrasena = null;
            return Ok(usuario);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error al obtener el usuario");
        }
    }
}


public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
