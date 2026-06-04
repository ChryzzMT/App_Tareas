using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Materia> Materias { get; set; }
    public DbSet<Tarea> Tareas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
}