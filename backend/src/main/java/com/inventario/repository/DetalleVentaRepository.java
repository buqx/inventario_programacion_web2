package com.inventario.repository;

import com.inventario.domain.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
  boolean existsByProductoId(Long productoId);
}
