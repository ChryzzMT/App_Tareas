using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using tiendaweb_backend.Datos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(opciones =>
    {
        // Evita que una navegación Tarea/Subtarea corte la respuesta del cliente.
        opciones.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddOpenApi();

// swagger
builder.Services.AddSwaggerGen();

// La base de cátedra sigue siendo SQL Server.
// USE_SQLITE=1 crea un archivo local para ejecutar fuera de esa red, sin cambiar la lógica.
var usarSqlite = string.Equals(Environment.GetEnvironmentVariable("USE_SQLITE"), "1", StringComparison.Ordinal);
if (usarSqlite)
{
    var rutaSqlite = Path.Combine(builder.Environment.ContentRootPath, "priorizacion-local.db");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite($"Data Source={rutaSqlite}"));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

//CORS: 4200 era Angular; 5173 y 4173 son el cliente React (Vite).
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:4200",
                    "http://127.0.0.1:4200",
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:4173",
                    "http://127.0.0.1:4173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

if (usarSqlite)
{
    using var alcance = app.Services.CreateScope();
    var baseLocal = alcance.ServiceProvider.GetRequiredService<AppDbContext>();
    baseLocal.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//CORS
app.UseCors("AllowAngular");

app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();