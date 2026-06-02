namespace tiendaweb_backend.Datos;

public class Dias
{
    public int dia {get; set;}
    public int diaSemana {get; set;}
    public bool Vacio {get; set;}

    public List<Tarea> ListaTareaDia { get; set; }

}