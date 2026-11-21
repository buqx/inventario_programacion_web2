package com.inventario.repository; import com.inventario.domain.Producto; import org.springframework.data.jpa.repository.*; import java.util.*;
public interface ProductoRepository extends JpaRepository<Producto,Long> { List<Producto> findByActivoTrue(); }
