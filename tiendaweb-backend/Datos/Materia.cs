namespace tiendaweb_backend.Datos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Materia")]
public class Materia
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
    public int IdMateria { get; set; }
    public string? NombreMateria {get; set; }
    public int ? PesoMateria { get; set; }
    
    [ForeignKey("Usuario")]
    public int IdUsuario { get; set; }
}