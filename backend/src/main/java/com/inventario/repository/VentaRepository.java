package com.inventario.repository; import org.springframework.data.jpa.repository.JpaRepository;

 import com.inventario.domain.Venta;
public interface VentaRepository extends JpaRepository<Venta,Long> {}
