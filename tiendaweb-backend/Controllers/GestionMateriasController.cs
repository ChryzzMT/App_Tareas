using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

[ApiController]
[Route("[controller]")]
public class GestionMateriasController:Controller
{
    private GestionMaterias GestionMaterias;

    public GestionMateriasController(AppDbContext db)
    {
        GestionMaterias = new GestionMaterias(db); 
    }

    [HttpPut("SetUsuario")]
    public void SetUsuario(int userid)
    {
        GestionMaterias.SetUser(userid);
    }

    [HttpGet("lista-materias")]
    public IEnumerable<Materia> ListaMaterias()
    {
        return GestionMaterias.ListaMaterias();
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