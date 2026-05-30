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
    public string EliminarUsuario( [FromBody] Usuario usuario)
    {
        _gestionuser.EliminarUsuario(usuario);
        return $"Usuario: {usuario.nombre}  eliminado correctamente";
    }

    [HttpPost("CrearUsuario")]
    public string CrearUsuario([FromBody] Usuario usuario)
    {
        _gestionuser.CrearUsuario(usuario);
        return $"Usuario creado correctamente el usuario {usuario.nombre}";
    }

    [HttpPut("EditarUsuario")]
    public string EditarUsuario([FromBody] Usuario usuario)
    {
         _gestionuser.ModificarUsuario(usuario);
         
         return  $"Usuario: {usuario.nombre}  editado correctamente";
    }
}