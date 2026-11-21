package com.inventario.service;

import com.inventario.domain.Producto;
import com.inventario.dto.Dtos.ProductoRequest;
import com.inventario.exception.ApiException;
import com.inventario.repository.DetalleVentaRepository;
import com.inventario.repository.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
  private final ProductoRepository repo;
  private final DetalleVentaRepository detalleVentaRepository;

  public ProductoService(ProductoRepository repo, DetalleVentaRepository detalleVentaRepository) {
    this.repo = repo;
    this.detalleVentaRepository = detalleVentaRepository;
  }

  public List<Producto> listar() {
    return repo.findAll();
  }

  public Producto buscar(Long id) {
    return repo.findById(id).orElseThrow(() -> new ApiException("Producto no encontrado"));
  }

  public List<Producto> catalogo() {
    return repo.findByActivoTrue();
  }

  public Producto crear(ProductoRequest r) {
    validar(r);
    Producto p = new Producto();
    aplicar(p, r);
    return repo.save(p);
  }

  public Producto actualizar(Long id, ProductoRequest r) {
    validar(r);
    Producto p = buscar(id);
    aplicar(p, r);
    return repo.save(p);
  }

  public void eliminar(Long id) {
    buscar(id);
    if (detalleVentaRepository.existsByProductoId(id)) {
      throw new ApiException("No puede eliminar un producto asociado a ventas. Puede desactivarlo desde edición.");
    }
    repo.deleteById(id);
  }

  private void validar(ProductoRequest r) {
    if (r.nombre() == null || r.nombre().trim().isEmpty()) throw new ApiException("El nombre del producto es obligatorio");
    if (r.precio() == null || r.precio().signum() < 0) throw new ApiException("El precio debe ser válido");
    if (r.stock() == null || r.stock() < 0) throw new ApiException("El stock no puede ser negativo");
  }

  private void aplicar(Producto p, ProductoRequest r) {
    p.setNombre(r.nombre().trim());
    p.setDescripcion(r.descripcion());
    p.setPrecio(r.precio());
    p.setStock(r.stock());
    p.setActivo(r.activo() == null || r.activo());
  }
}
