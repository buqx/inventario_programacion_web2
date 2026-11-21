package com.inventario.domain;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity @Table(name="clientes")
public class Cliente { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String nombre; @Column(nullable=false,unique=true) private String email; private String telefono; private String direccion;
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getTelefono(){return telefono;} public void setTelefono(String v){telefono=v;} public String getDireccion(){return direccion;} public void setDireccion(String v){direccion=v;}
}
