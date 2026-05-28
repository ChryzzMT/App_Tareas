var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // <--- ESTA LÍNEA ES CLAVE

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:4200") // Cambiar si el puerto es diferente
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger(); // <--- Habilita la generación del JSON
    app.UseSwaggerUI(); // <--- Habilita la interfaz visual (la página web)
}

//CORS
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();