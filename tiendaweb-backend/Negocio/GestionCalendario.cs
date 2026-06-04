using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public enum LMeses {
Enero =1,
Febrero,
Marzo,
Abril,
Mayo,
Junio,
Julio,
Agosto,
Septiembre,
Octubre,
Noviembre,
Diciembre
}

public enum Ldias
{
    Lunes=0,
    Martes,
    Miercoles,
    Jueves,
    Viernes,
    Sabado,
    Domingo
}

public class GestionCalendario
{
    private AppDbContext _db;
    public static   int Usuarioid;

    public static List<Pair<int, List<Mes>>> Calendario;
    
    

    public GestionCalendario(AppDbContext p)
    {
        _db = p;

        if (Calendario != null && Calendario.Count > 0)
        {
            return; 
        }

        Calendario = new List<Pair<int, List<Mes>>>();
    
        int year = DateTime.Now.Year;
        int maxyear = year + 5;
        int daysmonths;

        for (int i = year; i <= maxyear; ++i)
        {
           
            var nuevoAnio = new Pair<int, List<Mes>>(i, new List<Mes>());
            Calendario.Add(nuevoAnio);

            for (int k = 1; k <= 12; ++k)
            {
                daysmonths = DateTime.DaysInMonth(i, k);
                Mes mesList = new Mes { mes = k, ListaDias = new List<Dias>() }; 
            
                for (int j = 1; j <= daysmonths; ++j)
                {
                    Dias dia = new Dias();
                    dia.dia = j;
                    dia.diadelsemana = new DateTime(i, k, j).DayOfWeek;
                    dia.ListaTareaDia = new List<Tarea>(); 
                    dia.Vacio = true; 

                    mesList.ListaDias.Add(dia);
                }
                
                nuevoAnio.Second.Add(mesList);
            }
        }
    }


    

    public void setuser(int iser)
    {
        GestionCalendario.Usuarioid = iser;
    }

    public string ObtenerMes(int mes)
    {
        LMeses m = (LMeses)mes;
        
        return m.ToString();
    }

    public string ObtenerDia(int dia)
    {
        Ldias d =  (Ldias)dia;
        return d.ToString();
    }

    public Mes? ObtenerDiasDeunMes(int year, int mes)
    {
        
        var target  = Calendario.Find(c => c.First == year );
        return target?.Second.Find(k=> k.mes == mes);
        
    }

    public List<Tarea>? DevolverTareasDeunDia(int year, int mes, int dia)
    {
        var target  = Calendario.Find(c => c.First == year ).Second.Find(k => k.mes == mes )
            .ListaDias.Find(l => l.dia == dia);
        
        return target?.ListaTareaDia;
        
    }

    public bool EstaVacioEldia(int year, int mes, int dia)
    {
        var target  = Calendario.Find(c => c.First == year ).Second.Find(k => k.mes == mes )
            .ListaDias.Find(l => l.dia == dia);
        return target?.ListaTareaDia.Count == 0;
    }

    public void ActualizarCalendario()
    {
        if (Usuarioid == 0) return; // Si no hay usuario seteado, no hacemos nada

        int anioMin = DateTime.Now.Year;
        int anioMax = anioMin + 5;

       
        var tareasDelUsuario = _db.Tareas
            .Where(t => t.idUsuario == Usuarioid 
                        && t.FechaEntrega.HasValue 
                        && t.FechaEntrega.Value.Year >= anioMin 
                        && t.FechaEntrega.Value.Year <= anioMax)
            .ToList();

        
        foreach (var anioPair in Calendario)
        {
            foreach (var mes in anioPair.Second)
            {
                foreach (var dia in mes.ListaDias)
                {
                    dia.ListaTareaDia.Clear();
                    dia.Vacio = true;
                }
            }
        }

        // 3. Repartimos las tareas en nuestra estructura en memoria
        foreach (var tarea in tareasDelUsuario)
        {
            DateTime fecha = tarea.FechaEntrega!.Value;

            int indexyear = Calendario.FindIndex(t => t.First == fecha.Year);
            
            int indexmes = Calendario[indexyear].Second.FindIndex(k => k.mes == fecha.Month);
            
            int indexdia = Calendario[indexyear].Second[indexmes].ListaDias.FindIndex(o=> o.dia == fecha.Day);
            
            Calendario[indexyear].Second[indexmes].ListaDias[indexdia].ListaTareaDia.Add(tarea);
            Calendario[indexyear].Second[indexmes].ListaDias[indexdia].Vacio = false;
            
            

        }
    }
};

public class Pair<T, T1>
{
    public Pair()
    {
        
    }

    public Pair(T f, T1 s)
    {
        this.First = f;
        this.Second = s;
    }

    public T First { get; set; } // year
    public T1 Second { get; set; } // lista de meses
}