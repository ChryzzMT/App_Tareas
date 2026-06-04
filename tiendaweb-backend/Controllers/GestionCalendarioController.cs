using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

public class GestionCalendarioController: Controller
{
    
    private GestionCalendario _gestionCalendario;

    public GestionCalendarioController(AppDbContext context)
    {
        _gestionCalendario = new GestionCalendario(context);
    }

    [HttpPut("setuserid")]
    public void setuserid(int id)
    {
        _gestionCalendario.setuser(id);
    }

    [HttpGet("ObtenerNombreMes")]
    public string ObtenerNombreMes(int mes)
    {
        return _gestionCalendario.ObtenerMes(mes);
    }

    [HttpGet("ObtenetNombreDia")]
    public string ObtenetNombreDia(int dia)
    {
        return _gestionCalendario.ObtenerDia(dia);
    }

    [HttpGet("ObtenerDiasdeunMes")]
    public Mes ObtenerDiasdeunMes(int year,int mes)
    {
       return  _gestionCalendario.ObtenerDiasDeunMes(year, mes);
    }

    [HttpGet("DevolverTareasdeunDia")]
    public List<Tarea>? DevolverTareasdeunDia(int year, int mes, int dia)
    {
        return _gestionCalendario.DevolverTareasDeunDia(year, mes, dia);
    }

    [HttpGet("VacioEldia")]
    public bool VacioEldia(int year, int mes, int dia)
    {
        return _gestionCalendario.EstaVacioEldia(year, mes,dia);
        
    }

    [HttpPut("RefrescarCalendario")]
    public void RefrescarCalendario()
    {
        _gestionCalendario.ActualizarCalendario();
    }
}