package com.inventario.service;

import com.inventario.domain.Cliente;
import com.inventario.dto.Dtos.ClienteRequest;
import com.inventario.exception.ApiException;
import com.inventario.repository.ClienteRepository;
import com.inventario.repository.VentaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
  private final ClienteRepository repo;
  private final VentaRepository ventaRepository;

  public ClienteService(ClienteRepository repo, VentaRepository ventaRepository) {
    this.repo = repo;
    this.ventaRepository = ventaRepository;
  }

  public List<Cliente> listar() { return repo.findAll(); }
  public Cliente buscar(Long id) { return repo.findById(id).orElseThrow(() -> new ApiException("Cliente no encontrado")); }

  public Cliente crear(ClienteRequest r) {
    validar(r);
    Cliente c = new Cliente();
    aplicar(c, r);
    return repo.save(c);
  }

  public Cliente actualizar(Long id, ClienteRequest r) {
    validar(r);
    Cliente c = buscar(id);
    aplicar(c, r);
    return repo.save(c);
  }

  public void eliminar(Long id) {
    buscar(id);
    if (ventaRepository.existsByClienteId(id)) {
      throw new ApiException("No puede eliminar un cliente asociado a ventas.");
    }
    repo.deleteById(id);
  }

  private void validar(ClienteRequest r) {
    if (r.nombre() == null || r.nombre().trim().isEmpty()) throw new ApiException("El nombre del cliente es obligatorio");
    if (r.email() == null || r.email().trim().isEmpty()) throw new ApiException("El correo del cliente es obligatorio");
  }

  private void aplicar(Cliente c, ClienteRequest r) {
    c.setNombre(r.nombre().trim());
    c.setEmail(r.email().trim());
    c.setTelefono(r.telefono());
    c.setDireccion(r.direccion());
  }
}
