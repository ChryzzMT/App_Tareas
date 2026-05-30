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
    public void AgregarMateria([FromBody] Materia materia)
    {
        GestionMaterias.AgregarMateria(materia);
    }

    [HttpPut("actualizar")]
    public void ActualizarPesoMateria([FromBody] Materia m)
    {
        GestionMaterias.ActualizarPesoMateria(m);
    }
    
    [HttpDelete("eliminar-materias")]
    public void EliminarMaterias([FromBody] List<string> nombres)
    {
        GestionMaterias.EliminarMaterias( nombres);
    }
}