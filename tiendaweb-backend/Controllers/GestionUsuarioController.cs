using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionUsuarioController : Controller
{
    private  GestionUsuario _gestionuser;

    public GestionUsuarioController(AppDbContext context)
    {
        _gestionuser = new GestionUsuario(context);
    }
    
    [HttpPost("CrearUsuario")]
    public int CrearUsuario([FromBody] Usuario usuario)
    {
       return _gestionuser.CrearUsuario(usuario);
        
    }
    
    [HttpGet("VerificarUsuario")]
    public Usuario? Log(string m,string c)
    {
        return _gestionuser.Login(m,c);
    }
}