using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tiendaweb_backend.Datos;
[Table("Usuario")]
public class Usuario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idUsuario { get; set; }
    public string Nombre { get; set; }
    public string Email { get; set; }
    public string Contrasena { get; set; }
}