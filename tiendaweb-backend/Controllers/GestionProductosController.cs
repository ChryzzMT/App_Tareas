using Microsoft.AspNetCore.Mvc;
using tiendaweb_backend.Datos;
using tiendaweb_backend.Negocio;

namespace tiendaweb_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class GestionProductosController : ControllerBase
{
    private GestionProductos _gestionProductos;

    public GestionProductosController()
    {
        _gestionProductos = new GestionProductos();
    }

    [HttpGet("lista-productos")]
    public IEnumerable<Producto> ListaProductos()
    {
        return _gestionProductos.ListaProductos();
    }
    
    [HttpGet("{id}")]
    public ActionResult<Producto> ObtenerProducto(int id)
    {
        var producto = _gestionProductos.ObtenerProducto(id);

        if (producto == null)
            return NotFound();

        return producto;
    }

    [HttpPost]
    public ActionResult<Producto> CrearProducto(Producto producto)
    {
        _gestionProductos.CrearProducto(producto);

        return Ok(producto);
    }

    [HttpPut("{id}")]
    public IActionResult ActualizarProducto(int id, Producto productoEditado)
    {
        var producto = _gestionProductos.ListaProductos().FirstOrDefault(p => p.Id == id);

        if (producto == null)
            return NotFound();
        
        _gestionProductos.ActualizarProducto(productoEditado);

        return Ok(producto);
    }

    [HttpDelete("{id}")]
    public IActionResult EliminarProducto(int id)
    {
        var producto = _gestionProductos.ListaProductos().FirstOrDefault(p => p.Id == id);

        if (producto == null)
            return NotFound();

        _gestionProductos.EliminarProducto(id);

        return NoContent();
    }
}