package com.inventario.service;

import com.inventario.domain.Cliente;
import com.inventario.domain.DetalleVenta;
import com.inventario.domain.Factura;
import com.inventario.domain.Producto;
import com.inventario.domain.Venta;
import com.inventario.dto.Dtos.ItemVenta;
import com.inventario.dto.Dtos.VentaRequest;
import com.inventario.exception.ApiException;
import com.inventario.repository.ClienteRepository;
import com.inventario.repository.FacturaRepository;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.VentaRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VentaService {
  private final VentaRepository ventas;
  private final ClienteRepository clientes;
  private final ProductoRepository productos;
  private final FacturaRepository facturas;

  public VentaService(VentaRepository ventas, ClienteRepository clientes, ProductoRepository productos, FacturaRepository facturas) {
    this.ventas = ventas;
    this.clientes = clientes;
    this.productos = productos;
    this.facturas = facturas;
  }

  public List<Venta> listar() {
    return ventas.findAll();
  }

  @Transactional
  public Venta crear(VentaRequest r) {
    if (r.items() == null || r.items().isEmpty()) {
      throw new ApiException("La venta debe tener productos");
    }

    Cliente cliente = clientes.findById(r.clienteId())
        .orElseThrow(() -> new ApiException("Cliente no encontrado"));

    Venta venta = new Venta();
    venta.setCliente(cliente);
    venta.setFecha(LocalDateTime.now());
    BigDecimal total = BigDecimal.ZERO;

    for (ItemVenta item : r.items()) {
      if (item.cantidad() == null || item.cantidad() < 1) {
        throw new ApiException("Cantidad inválida");
      }

      Producto producto = productos.findById(item.productoId())
          .orElseThrow(() -> new ApiException("Producto no encontrado"));

      if (producto.getStock() < item.cantidad()) {
        throw new ApiException("Stock insuficiente para: " + producto.getNombre());
      }

      producto.setStock(producto.getStock() - item.cantidad());
      productos.save(producto);

      DetalleVenta detalle = new DetalleVenta();
      detalle.setVenta(venta);
      detalle.setProducto(producto);
      detalle.setCantidad(item.cantidad());
      detalle.setPrecioUnitario(producto.getPrecio());
      venta.getDetalles().add(detalle);

      total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(item.cantidad())));
    }

    venta.setTotal(total);
    Venta guardada = ventas.save(venta);

    Factura factura = new Factura();
    factura.setVenta(guardada);
    factura.setEmitida(LocalDateTime.now());
    factura.setTotal(total);
    factura.setNumero("FAC-" + System.currentTimeMillis());
    facturas.save(factura);
    guardada.setFactura(factura);

    return guardada;
  }
}

