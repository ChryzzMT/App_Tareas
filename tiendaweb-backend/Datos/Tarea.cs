namespace tiendaweb_backend.Datos;

public class Tarea
{
    public string IdTarea { get; set; }
    public string? Titulo { get; set; }
    public string? Descripcion { get; set; }
    public int? PesoTarea { get; set; }
    public DateTime? Fecha { get; set; }
    public string estado { get; set; } 
    public int IdMateria { get; set; }
    public int IDusuario { get; set; }
    
    
    
}