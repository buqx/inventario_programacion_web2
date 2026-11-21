package com.inventario.repository;

import com.inventario.domain.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {
  boolean existsByClienteId(Long clienteId);
}
