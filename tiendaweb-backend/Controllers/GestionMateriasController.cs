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
        if (materia == null)
        {
            return BadRequest("Tiene que agregar los datos para la materia");
        }
        GestionMaterias.AgregarMateria(materia);
        return Ok(new { mensaje = "materia agregada correctamente", datos = materia });
    }

    [HttpPut("actualizar")]
    public IActionResult ActualizarPesoMateria([FromBody] Materia m)
    {
        if ( m==null)
        {
            return BadRequest("Ingrese el mas info para actualizar la materia");
        }
        GestionMaterias.ActualizarPesoMateria(m);
        return Ok(new { mensaje = "Se actualizo el peso de la Materia" });
    }
    
    [HttpDelete("eliminar-materias")]
    public IActionResult EliminarMaterias([FromBody] List<string> nombres)
    {
        if (nombres == null)
        {
            return BadRequest("Elija la materia que desee eliminar");
        }
        GestionMaterias.EliminarMaterias( nombres);
        return Ok(new { mensaje = "materia eliminada correctamente"});
    }
}