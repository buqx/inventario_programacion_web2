package com.inventario.repository; import org.springframework.data.jpa.repository.JpaRepository;

 import com.inventario.domain.Cliente;
public interface ClienteRepository extends JpaRepository<Cliente,Long> {}
