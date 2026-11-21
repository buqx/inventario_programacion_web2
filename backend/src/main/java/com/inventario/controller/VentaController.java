package com.inventario.controller;
import com.inventario.domain.Venta; import com.inventario.dto.Dtos.*; import com.inventario.service.VentaService; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/ventas") @CrossOrigin
public class VentaController { private final VentaService service; public VentaController(VentaService service){this.service=service;} @GetMapping public List<Venta> listar(){return service.listar();} @PostMapping public Venta crear(@RequestBody VentaRequest r){return service.crear(r);} }
