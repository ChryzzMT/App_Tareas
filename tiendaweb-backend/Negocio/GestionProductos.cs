using tiendaweb_backend.Datos;

namespace tiendaweb_backend.Negocio;

public class GestionProductos
{
    private static List<Producto> _dbProductos = new()
    {
        new() {Id = 1, Nombre = "Mouse", Descripcion = "hardware", Precio = 12.45},
        new() {Id = 2, Nombre = "Monitor", Descripcion = "pantalla", Precio = 100.0},
        new() {Id = 3, Nombre = "Teclado", Descripcion = "mecanico", Precio = 50.5},
        new() {Id = 4, Nombre = "Mousepad", Descripcion = "pad lg", Precio = 12.5},
        new() {Id = 5, Nombre = "Hub", Descripcion = "multiple", Precio = 99.5}
    };
    
    public List<Producto> ListaProductos()
    {
        //en lugar de hacer una lista estatica, se debe llamar a la base de datos
        return _dbProductos;
    }

    public Producto? ObtenerProducto(int id)
    {
        return _dbProductos.FirstOrDefault(p => p.Id == id);
    }

    public void CrearProducto(Producto producto)
    {
        producto.Id = _dbProductos.Count == 0 ? 1 : _dbProductos.Max(p => p.Id) + 1;
        _dbProductos.Add(producto);
    }

    public void ActualizarProducto(Producto producto)
    {
        var p =  _dbProductos.FirstOrDefault(p => p.Id == producto.Id);
        p?.Nombre = producto.Nombre;
        p?.Descripcion = producto.Descripcion;
        p?.Precio = producto.Precio;
    }

    public void EliminarProducto(int id)
    {
        var p =  _dbProductos.FirstOrDefault(p => p.Id == id);
        if (p != null) 
            _dbProductos.Remove(p);
    }
}