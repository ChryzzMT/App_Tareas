namespace tiendaweb_backend.Datos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Tarea")]
public class Tarea
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdTarea { get; set; }
    public string? Titulo { get; set; }
    public string? Descripcion { get; set; }
    public int? PesoTarea { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public string Estado { get; set; } 
    public int IdMateria { get; set; }
    public int IDusuario { get; set; }
    
    
    
}