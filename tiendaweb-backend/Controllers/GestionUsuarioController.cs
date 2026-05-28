using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;


namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionUsuarioController :  ControllerBase
{
    private GestionUsuario _gestionuser;

    public GestionUsuarioController()
    {
        _gestionuser = new GestionUsuario();
    }

    [HttpGet]
    public IEnumerable<Usuario> Listarusuario()
    {
        return Enumerable.Range(0, _gestionuser.listasdeusaurios.Count).Select(index => new Usuario
        {
            Id = _gestionuser.listasdeusaurios[index].Id,
            nombre = _gestionuser.listasdeusaurios[index].nombre

        });
    }

    [HttpPost]
    public void CrearUsuario(Usuario usuario)
    {
        _gestionuser.CrearUsuario(usuario);
    }

    [HttpGet]
    public Usuario? ObtenerUsuario(string email , string password)
    {
        return _gestionuser.encontrarUsuario(email, password);
    }
        
    
}