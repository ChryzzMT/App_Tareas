using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionTareas
{
    public static List<Tarea> Tareas { get; set; }= new List<Tarea>()
    {
        new(){IdTarea = "1",Titulo = "Practico #3",Descripcion = "Hacer el practico #3 de calculo 1",FechaDeEntrega = new DateTime(2026,05,07), PesoTarea = 5},
        new(){IdTarea = "2",Titulo = "Ensayo Novela",Descripcion = "Hacer un ensayo sobre mi novela favorita",FechaDeEntrega = new DateTime(2026,05,07), PesoTarea = 3},
        new(){IdTarea = "3",Titulo = "Investigacion antropologia",Descripcion = "Hacer la investigavionde los 13 objetivos",FechaDeEntrega = new DateTime(2026,05,07), PesoTarea = 5},
        new(){IdTarea = "4",Titulo = "Practica de fisica",Descripcion = "Realizar la practica de fisica",FechaDeEntrega = new DateTime(2026,05,07), PesoTarea = 8}
    };

    public void AgregarTarea(Tarea tarea,int year,int mes, int dia , int hora, int min)
    {
        tarea.FechaDeEntrega = new System.DateTime(year, mes, dia, hora, min,0);
        Tareas.Add(tarea);
        
    }

    public void EliminarTarea(string titu)
    {
        for (int i = 0; i < Tareas.Count;i++)
        {
            if (Tareas[i].Titulo == titu)
            {
                Tareas.RemoveAt(i);
            }
        }
    }

    public void ActualizarTitulo(string antiguoTitulo, string nuevoTitulo)
    {
        for (int i = 0; i < Tareas.Count; i++)
        {
            if (Tareas[i].Titulo == antiguoTitulo)
            {
                Tareas[i].Titulo = nuevoTitulo;
            }
        }
    }

    public void ActualizarDescripcion(string idTar, string nuevaDescripcion)
    {
        for (int i = 0; i < Tareas.Count; i++)
        {
            if (Tareas[i].IdTarea == idTar)
            {
                Tareas[i].Descripcion = nuevaDescripcion;
            }
        }
    }

    public void ActualizarPesoTarea(string idTar, int nuevoPeso)
    {
        for (int i = 0; i < Tareas.Count; i++)
        {
            if (Tareas[i].IdTarea == idTar)
            {
                Tareas[i].PesoTarea = nuevoPeso;
            }
        }
    }   

    public void ActualizarFecha(string idTar,int year,int mes, int dia , int hora, int min )
    {
        for (int i = 0; i < Tareas.Count; i++)
        {
            if (Tareas[i].IdTarea == idTar)
            {
                Tareas[i].FechaDeEntrega=new System.DateTime(year,mes,dia, hora,min,0);
            }
        }
    }
}