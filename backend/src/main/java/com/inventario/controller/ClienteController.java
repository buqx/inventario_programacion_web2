package com.inventario.controller;

import com.inventario.domain.Cliente;
import com.inventario.dto.Dtos.ClienteRequest;
import com.inventario.service.ClienteService;
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
@RequestMapping("/api/clientes")
@CrossOrigin
public class ClienteController {
  private final ClienteService service;

  public ClienteController(ClienteService service) {
    this.service = service;
  }

  @GetMapping
  public List<Cliente> listar() {
    return service.listar();
  }

  @GetMapping("/{id}")
  public Cliente buscar(@PathVariable Long id) {
    return service.buscar(id);
  }

  @PostMapping
  public Cliente crear(@RequestBody ClienteRequest r) {
    return service.crear(r);
  }

  @PutMapping("/{id}")
  public Cliente actualizar(@PathVariable Long id, @RequestBody ClienteRequest r) {
    return service.actualizar(id, r);
  }

  @DeleteMapping("/{id}")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
