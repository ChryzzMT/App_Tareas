using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public enum LMeses {
ENERO =1,
Febrero,
Marzo,
Abril,
Mayo,
Junio,
Julio,
Agosto,
Septembre,
October,
November,    
}

public enum Ldias
{
    Lunes=1,
    Martes,
    Miercoles,
    Jueves,
    Viernes,
    Sabado,
    Domingo
}
public class GestionCalendario
{
    //DBdatos datos de bases de datos
    public readonly  int usuarioid;

    

    public string ObtenerMes(int mes)
    {
        LMeses m = (LMeses)mes;
        
        return m.ToString();
    }

    public String ObtenerDia(int dia)
    {
        Ldias d =  (Ldias)dia;
        return d.ToString();
    }
}