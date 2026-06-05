using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiendaweb_backend.Datos;

[Table("Subtarea")]
public class Subtarea
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idsubtarea  {get; set;}
    public string Descripcion {get; set;}
    

    // public bool? Completada {get; set;}
    
   [ForeignKey("Tarea")]
    public int idtarea {get; set;}
    
    public Tarea Tarea {get; set;}
    
    
}