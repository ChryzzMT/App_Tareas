using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionUsuarioController : Controller
{
    private readonly GestionUsuario _gestionuser;

    public GestionUsuarioController()
    {
        _gestionuser = new GestionUsuario();
    }

    [HttpGet("ListaDeUsuarios")]
    public IEnumerable<Usuario> ListarUsuario()
    {
        return _gestionuser.listasdeusuarios;
    }

    [HttpDelete("EliminarUsuario")]
    public IActionResult EliminarUsuario( [FromBody] Usuario usuario)
    {
        _gestionuser.EliminarUsuario(usuario);
        return Ok("Usuario eliminado correctamente");
    }

    [HttpPost("CrearUsuario")]
    public IActionResult CrearUsuario([FromBody] Usuario usuario)
    {
        _gestionuser.CrearUsuario(usuario);
        return Ok("Usuario creado correctamente");
    }
    
}