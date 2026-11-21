package com.inventario.dto;
import java.math.BigDecimal; import java.util.List;
public class Dtos {
 public record ProductoRequest(String nombre,String descripcion,BigDecimal precio,Integer stock,Boolean activo) {}
 public record ClienteRequest(String nombre,String email,String telefono,String direccion) {}
 public record ItemVenta(Long productoId,Integer cantidad) {}
 public record VentaRequest(Long clienteId,List<ItemVenta> items) {}
}
