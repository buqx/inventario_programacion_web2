package com.inventario.repository; import com.inventario.domain.Cliente; import org.springframework.data.jpa.repository.JpaRepository;
public interface ClienteRepository extends JpaRepository<Cliente,Long> {}
