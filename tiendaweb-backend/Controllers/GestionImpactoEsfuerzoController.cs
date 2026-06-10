using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionImpactoEsfuerzoController: Controller
{
    private GestionImpactoEsfuerzo gestionImpactoEsfuerzo;

    public GestionImpactoEsfuerzoController(AppDbContext db)
    {
        gestionImpactoEsfuerzo = new GestionImpactoEsfuerzo(db);
    }

    [HttpPut("SetUser")]
    public void SetUserid( [FromQuery]int id)
    {
        gestionImpactoEsfuerzo.SetUserid(id);
    }

    [HttpPut("asignar-impactoesfuerzo")]
    public void AsignarImpactoEsfuerzo()
    {
        gestionImpactoEsfuerzo.AsignarTareasEsfuerzo_Impacto();
    }
    
    [HttpGet("tareas-oportunidades")]
    public IEnumerable<Tarea> TareasOportunidades()
    {
        return GestionImpactoEsfuerzo.Oportunidades;
    }
    [HttpGet("tareas-gananciarapida")]
    public IEnumerable<Tarea> TareasGananciaRapida()
    {
        return GestionImpactoEsfuerzo.GananciaRapida;
    }
    [HttpGet("tareas-menorgan")]
    public IEnumerable<Tarea> TareasMenorGanancia()
    {
        return GestionImpactoEsfuerzo.MenorGanancia;
    }

    [HttpGet("tareas-descartar")] // descartar
    public IEnumerable<Tarea> TareasDescartar()
    {
        return GestionImpactoEsfuerzo.MinimaGanancia;
    }
    
    [HttpPost("CambiarCuadrantes")]
    public void CambiarEntreCuadrantes(string origen, string destino, int idTar)
    {
        gestionImpactoEsfuerzo.MovenEntreCuadrantes(origen, destino, idTar);
    }
}