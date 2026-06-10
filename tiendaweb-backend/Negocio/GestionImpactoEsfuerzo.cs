namespace tiendaweb_backend.Datos;

public class GestionImpactoEsfuerzo
{
    public static List<Tarea> MinimaGanancia { get; set; } = new();
    public static List<Tarea> MenorGanancia { get; set; } = new();
    public static List<Tarea> GananciaRapida {get; set;}= new();
    public static List<Tarea> Oportunidades {get; set;}= new();
    private static bool inicio = false;
    
    private readonly AppDbContext _db;
    public static int userId;

    public void SetUserid( int id)
    {
        userId = id;
    }
    public GestionImpactoEsfuerzo(AppDbContext db)
    {
        _db = db;
        if (!inicio)
        {
            AsignarTareasEsfuerzo_Impacto();
            inicio = true;
        }
    } 
    public void AsignarTareasEsfuerzo_Impacto()// para que esto funcione el sistema de asignacion de peso se hace con el usuario
    {//1-3 Descartar la tarea 3-6
        var Tareas= _db.Tareas.Where(u=>u.idUsuario==userId).ToList();
        var Materias = _db.Materias.Where(m => m.IdUsuario == userId).ToList();
        for (int i = 0; i < Tareas.Count; i++)
        {
            for (int j = 0; j < Materias.Count; j++)
            {
                if (Tareas[i].idMateria == Materias[j].IdMateria)
                {
                    if (Materias[j].PrioridadMateria >= 8)//si la prioridad del materia es mayor o igual a 8 es alta
                    {
                        if (Tareas[i].PesoTarea <= 3)
                        {
                            Oportunidades.Add(Tareas[i]);
                        } else if (Tareas[i].PesoTarea >=5)
                        {
                            GananciaRapida.Add(Tareas[i]);
                        }
                    }else if (Materias[j].PrioridadMateria >= 4)//si la prioridad es mayor o igual a 4 es media
                    {
                        if (Tareas[i].PesoTarea >=5)//tareas muy pesadas y con una prioridad media van a ganacia rapida
                        {
                            GananciaRapida.Add(Tareas[i]);
                        }else if (Tareas[i].PesoTarea == 2|| Tareas[i].PesoTarea==3)//tareas con esfuerzo bajo y prioridad media van a menor ganancia 
                        {
                            MenorGanancia.Add(Tareas[i]);
                        }
                    }else if (Materias[j].PrioridadMateria >= 1)//si la prioridad es mayor o igual 1 es baja
                    {
                        if (Tareas[i].PesoTarea >= 5)// tareas con baja prioridad y mucho esfuerzo van a minimaGanancia
                        {
                            MinimaGanancia.Add(Tareas[i]);
                        }
                        
                    }
                    
                }
            }
            
        }
    }


    public void MovenEntreCuadrantes(string origen, string destino, int IdTarea)
    {
        origen = origen.ToLower();
        destino = destino.ToLower();
        var Tareas= _db.Tareas.Where(u=>u.idUsuario==userId).ToList();
        Tarea t = new Tarea();
        for (int i = 0; i < Tareas.Count; i++)
        {
            if (Tareas[i].IdTarea == IdTarea)
            {
                t = Tareas[i];
            }
        }
        
        if (origen == "oportunidades")
        {
            MoverDeOportunidades(destino,t);
        }else if (origen == "ganancia_rapida")
        {
            MoverDeGananciaRapida(destino, t);
        }else if (origen == "menor_ganancia")
        {
            MoverDeMenorGanancia(destino, t);
        }else if(origen=="min-gan")
        {
            MoverDeMinimaGanancia(destino, t);
        }
    }
    public void MoverDeMenorGanancia(string destino, Tarea tarea)
    {
        if (destino == "oportunidades")
        {
            Oportunidades.Add(tarea);
        }else if (destino == "ganancia_rapida")
        {
            GananciaRapida.Add(tarea);
        }else if (destino == "minima")
        {
            MinimaGanancia.Add(tarea);
        }
        MenorGanancia.Remove(tarea);
        
    }
    
    public void MoverDeGananciaRapida(string destino, Tarea tarea)
    {
        if (destino == "oportunidades")
        {
            Oportunidades.Add(tarea);
        }else if (destino == "menor_ganancia")
        {
            MenorGanancia.Add(tarea);
        }else if (destino == "minima")
        {
            MinimaGanancia.Add(tarea);
        }
        GananciaRapida.Remove(tarea);
    }
    
    
    public void MoverDeOportunidades(string destino, Tarea tarea)
    {
        if (destino == "ganancia_rapida")
        {
            GananciaRapida.Add(tarea);
        }else if (destino == "menor_ganancia")
        {
            MenorGanancia.Add(tarea);
        }else if (destino == "minima")
        {
            MinimaGanancia.Add(tarea);
        }
        Oportunidades.Remove(tarea);
    }
    public void MoverDeMinimaGanancia(string destino, Tarea tarea)
    {
        if (destino == "oportunidades")
        {
            Oportunidades.Add(tarea);
        }else if (destino == "ganancia_rapida")
        {
            GananciaRapida.Add(tarea);
        }else if (destino == "menor_ganancia")
        {
            MenorGanancia.Add(tarea);
        }
        MinimaGanancia.Remove(tarea);
    }
}