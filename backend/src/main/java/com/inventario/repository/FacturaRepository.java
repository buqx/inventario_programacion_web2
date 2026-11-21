package com.inventario.repository; import com.inventario.domain.Factura; import org.springframework.data.jpa.repository.JpaRepository;
public interface FacturaRepository extends JpaRepository<Factura,Long> {}
