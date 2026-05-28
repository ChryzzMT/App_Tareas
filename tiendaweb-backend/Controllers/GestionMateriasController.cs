using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

[ApiController]
[Route("[controller]")]
public class GestionMateriasController:Controller
{
    private GestionMaterias GestionMaterias;

    public GestionMateriasController()
    {
        GestionMaterias = new GestionMaterias();
    }

    [HttpGet("lista-materias")]
    public IEnumerable<Materia> ListaMaterias()
    {
        return GestionMaterias.Materias;
    }

    [HttpPost("agregar-materia")]
    public IActionResult AgregarMateria([FromBody] Materia materia)
    {
        GestionMaterias.AgregarMateria(materia);
        return Ok(new { mensaje = "materia agregada correctamente", datos = materia });
    }

    [HttpDelete("eliminar-materias")]
    public IActionResult EliminarMaterias([FromBody] List<string> nombres)
    {
        GestionMaterias.EliminarMaterias( nombres);
        return Ok(new { mensaje = "materia eliminada correctamente"});
    }
}