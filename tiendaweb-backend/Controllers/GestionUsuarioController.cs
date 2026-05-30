using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionUsuarioController : Controller
{
    private GestionUsuario _gestionuser;

    public GestionUsuarioController()
    {
        _gestionuser = new GestionUsuario();
    }

    [HttpGet("ListaDeUsuarios")]
    public IEnumerable<Usuario> ListarUsuario()
    {
        return GestionUsuario.Listasdeusuarios;
    }

    [HttpDelete("EliminarUsuario")]
    public void EliminarUsuario(  int id)
    {
        _gestionuser.EliminarUsuario(id);
        
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