package com.inventario.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventario.dto.Dtos.VentaRequest;
import com.inventario.dto.Dtos.VentaResponse;
import com.inventario.service.VentaService;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin
public class VentaController {
  private final VentaService service;

  public VentaController(VentaService service) {
    this.service = service;
  }

  @GetMapping
  public List<VentaResponse> listar() {
    return service.listar();
  }

  @PostMapping
  public VentaResponse crear(@RequestBody VentaRequest request) {
    return service.crear(request);
  }

  @DeleteMapping("/{id}")
  public void eliminar(@PathVariable Long id) {
    service.eliminar(id);
  }
}
