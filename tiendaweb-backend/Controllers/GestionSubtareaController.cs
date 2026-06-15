using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionSubtareaController : Controller
{

    private GestionSubtareas _gestionSubtareas;
    public GestionSubtareaController(AppDbContext context)
    {
         _gestionSubtareas = new GestionSubtareas(context);
    }

    [HttpPut("SetUser")]
    public void PutUser([FromBody]int id)
    {
        _gestionSubtareas.SetUser(id);
    }

    [HttpGet("ListarSubtareas")]
    public List<Subtarea> ListarSubtareas( int idtarea)
    {
        return _gestionSubtareas.ListarSubtareasTarea(idtarea);

    }

    [HttpDelete("DeleteSubtarea")]
    public void DeleteSubtarea(int id)
    {
        _gestionSubtareas.EliminarSubtarea(id);
        
    }
    
    [HttpPut("ActualizarDescripcion")]
    public void ActualizarDescripcion(int id, string descripcion)
    {
        _gestionSubtareas.ModificarDescripcionSubtarea(id, descripcion);
    }

    [HttpPost("CreateSubtarea")]
    public void CreateSubtarea( int tareaid , string descripcion)
    {
        _gestionSubtareas.CrearSubtarea(tareaid ,descripcion);
    }
}