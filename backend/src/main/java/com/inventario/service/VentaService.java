package com.inventario.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.inventario.domain.Cliente;
import com.inventario.domain.DetalleVenta;
import com.inventario.domain.Factura;
import com.inventario.domain.Producto;
import com.inventario.domain.Venta;
import com.inventario.dto.Dtos.ClienteVentaResponse;
import com.inventario.dto.Dtos.DetalleVentaResponse;
import com.inventario.dto.Dtos.FacturaVentaResponse;
import com.inventario.dto.Dtos.ItemVenta;
import com.inventario.dto.Dtos.VentaRequest;
import com.inventario.dto.Dtos.VentaResponse;
import com.inventario.exception.ApiException;
import com.inventario.repository.ClienteRepository;
import com.inventario.repository.FacturaRepository;
import com.inventario.repository.ProductoRepository;
import com.inventario.repository.VentaRepository;

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

  @Transactional(readOnly = true)
  public List<VentaResponse> listar() {
    return ventas.findAll().stream().map(this::toResponse).toList();
  }

  @Transactional
  public VentaResponse crear(VentaRequest r) {
    if (r.items() == null || r.items().isEmpty()) {
      throw new ApiException("La venta debe tener al menos un producto");
    }

    Cliente cliente = clientes.findById(r.clienteId())
        .orElseThrow(() -> new ApiException("Cliente no encontrado"));

    Map<Long, Integer> cantidadesPorProducto = new HashMap<>();
    for (ItemVenta item : r.items()) {
      if (item.productoId() == null) throw new ApiException("Producto inválido");
      if (item.cantidad() == null || item.cantidad() < 1) {
        throw new ApiException("La cantidad mínima es 1");
      }
      cantidadesPorProducto.merge(item.productoId(), item.cantidad(), Integer::sum);
    }

    Venta venta = new Venta();
    venta.setCliente(cliente);
    venta.setFecha(LocalDateTime.now());
    BigDecimal total = BigDecimal.ZERO;

    for (Map.Entry<Long, Integer> entrada : cantidadesPorProducto.entrySet()) {
      Producto producto = productos.findById(entrada.getKey())
          .orElseThrow(() -> new ApiException("Producto no encontrado"));

      int cantidadSolicitada = entrada.getValue();
      if (cantidadSolicitada > producto.getStock()) {
        throw new ApiException("Stock insuficiente para: " + producto.getNombre()
            + " (disponible: " + producto.getStock() + ", solicitado: " + cantidadSolicitada + ")");
      }

      producto.setStock(producto.getStock() - cantidadSolicitada);
      productos.save(producto);

      DetalleVenta detalle = new DetalleVenta();
      detalle.setVenta(venta);
      detalle.setProducto(producto);
      detalle.setCantidad(cantidadSolicitada);
      detalle.setPrecioUnitario(producto.getPrecio());
      venta.getDetalles().add(detalle);

      total = total.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidadSolicitada)));
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

    return toResponse(guardada);
  }

  private VentaResponse toResponse(Venta venta) {
    Cliente cliente = venta.getCliente();
    Factura factura = venta.getFactura();

    ClienteVentaResponse clienteResponse = cliente == null ? null
        : new ClienteVentaResponse(cliente.getId(), cliente.getNombre(), cliente.getEmail());

    FacturaVentaResponse facturaResponse = factura == null ? null
        : new FacturaVentaResponse(factura.getId(), factura.getNumero(), factura.getEmitida(), factura.getTotal());

    List<DetalleVentaResponse> detalleResponse = venta.getDetalles().stream()
        .map(detalle -> new DetalleVentaResponse(
            detalle.getId(),
            detalle.getProducto().getId(),
            detalle.getProducto().getNombre(),
            detalle.getCantidad(),
            detalle.getPrecioUnitario(),
            detalle.getPrecioUnitario().multiply(BigDecimal.valueOf(detalle.getCantidad()))
        ))
        .toList();

    return new VentaResponse(
        venta.getId(), clienteResponse, venta.getFecha(), venta.getTotal(),
        venta.getEstado() == null ? null : venta.getEstado().name(), facturaResponse, detalleResponse
    );
  }
}

