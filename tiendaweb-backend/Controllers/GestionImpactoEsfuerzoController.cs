using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Controllers;

public class GestionImpactoEsfuerzoController: Controller
{
    private GestionImpactoEsfuerzo gestionImpactoEsfuerzo;

    public GestionImpactoEsfuerzoController(AppDbContext db)
    {
        gestionImpactoEsfuerzo = new GestionImpactoEsfuerzo(db);
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

    [HttpGet("tareas-minimgan")]
    public IEnumerable<Tarea> TareasMinimaGanancia()
    {
        return GestionImpactoEsfuerzo.MinimaGanancia;
    }
    
    [HttpPost("CambiarCuadrantes")]
    public void CambiarEntreCuadrantes(string origen, string destino, int idTar)
    {
        gestionImpactoEsfuerzo.MovenEntreCuadrantes(origen, destino, idTar);
    }
}