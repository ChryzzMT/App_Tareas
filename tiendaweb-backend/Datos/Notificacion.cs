namespace tiendaweb_backend.Datos;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Notificacion")]
public class Notificacion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idNotificacion {get; set;}
    
    [ForeignKey("Tarea")]
    public int IdTarea { get; set; }
    public Tarea? Tarea { get; set; }
    
    [ForeignKey("Usuario")]
    public int IdUsuario { get; set; }
    public Usuario? Usuario { get; set; }
}