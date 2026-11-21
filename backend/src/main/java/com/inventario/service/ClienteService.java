package com.inventario.service;

import com.inventario.domain.Cliente;
import com.inventario.dto.Dtos.ClienteRequest;
import com.inventario.exception.ApiException;
import com.inventario.repository.ClienteRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {
  private final ClienteRepository repo;

  public ClienteService(ClienteRepository repo) {
    this.repo = repo;
  }

  public List<Cliente> listar() {
    return repo.findAll();
  }

  public Cliente crear(ClienteRequest r) {
    Cliente c = new Cliente();
    c.setNombre(r.nombre());
    c.setEmail(r.email());
    c.setTelefono(r.telefono());
    c.setDireccion(r.direccion());
    return repo.save(c);
  }

  public Cliente actualizar(Long id, ClienteRequest r) {
    Cliente c = repo.findById(id).orElseThrow(() -> new ApiException("Cliente no encontrado"));
    c.setNombre(r.nombre());
    c.setEmail(r.email());
    c.setTelefono(r.telefono());
    c.setDireccion(r.direccion());
    return repo.save(c);
  }

  public void eliminar(Long id) {
    repo.deleteById(id);
  }
}
