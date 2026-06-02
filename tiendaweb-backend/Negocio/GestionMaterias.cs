using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionMaterias
{
    public static List<Materia> Materias { get; set; } = new List<Materia> {
        new() { NombreMateria = "Calculo I", PesoMateria = 4 },
        new() { NombreMateria = "Escritura Academica", PesoMateria = 5 },
        new() { NombreMateria = "Intro a Programacion", PesoMateria = 6 },
        new() { NombreMateria = "Fisica I", PesoMateria = 3 }
    };
    public void AgregarMateria(Materia mat)
    {
        Materias.Add(mat);
    }
    
    public void ActualizarPesoMateria(Materia mat)
    {
        foreach (var m in Materias)
        {
            if (m.NombreMateria == mat.NombreMateria)
            {
                m.PesoMateria = mat.PesoMateria;
            }
        }
    }

    public void EliminarMaterias(List<string> nombres)
    {
        for (int i = 0; i < nombres.Count; i++)
        {
            for (int j = 0; j < Materias.Count; j++)
            {
                if (Materias[j].NombreMateria == nombres[i])
                {
                    Materias.RemoveAt(j);
                }
            }
        }
    }
}