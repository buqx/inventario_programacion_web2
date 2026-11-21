package com.inventario.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class Dtos {
  public record ProductoRequest(String nombre, String descripcion, BigDecimal precio, Integer stock, Boolean activo) {}
  public record ClienteRequest(String nombre, String email, String telefono, String direccion) {}
  public record ItemVenta(Long productoId, Integer cantidad) {}
  public record VentaRequest(Long clienteId, List<ItemVenta> items) {}
  public record ClienteVentaResponse(Long id, String nombre, String email) {}
  public record FacturaVentaResponse(Long id, String numero, LocalDateTime emitida, BigDecimal total) {}
  public record DetalleVentaResponse(Long id, Long productoId, String producto, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {}
  public record VentaResponse(Long id, ClienteVentaResponse cliente, LocalDateTime fecha, BigDecimal total, String estado, FacturaVentaResponse factura, List<DetalleVentaResponse> detalles) {}
}
