package com.inventario.repository; import org.springframework.data.jpa.repository.JpaRepository;

 import com.inventario.domain.Factura;
public interface FacturaRepository extends JpaRepository<Factura,Long> {}
