package com.inventario.controller;

import com.inventario.domain.Producto;
import com.inventario.dto.Dtos.ProductoRequest;
import com.inventario.service.ProductoService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin
public class ProductoController {
  private final ProductoService service;

  public ProductoController(ProductoService service) {
    this.service = service;
  }

  @GetMapping
  public List<Producto> listar() {
    return service.listar();
  }

  @GetMapping("/{id}")
  public Producto buscar(@PathVariable Long id) {
    return service.buscar(id);
  }

  @GetMapping("/catalogo")
  public List<Producto> catalogo() {
    return service.catalogo();
  }

  @PostMapping
  public Producto crear(@RequestBody ProductoRequest r) {
    return service.crear(r);
  }

  @PutMapping("/{id}")
  public Producto actualizar(@PathVariable Long id, @RequestBody ProductoRequest r) {
    return service.actualizar(id, r);
  }

  @DeleteMapping("/{id}")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
