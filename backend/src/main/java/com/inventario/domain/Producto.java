package com.inventario.domain;
import java.math.BigDecimal;

 import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity @Table(name="productos")
public class Producto {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String nombre;
 private String descripcion; @Column(nullable=false) private BigDecimal precio; @Column(nullable=false) private Integer stock; private Boolean activo=true;
 public Long getId(){return id;} public void setId(Long id){this.id=id;} public String getNombre(){return nombre;} public void setNombre(String v){nombre=v;} public String getDescripcion(){return descripcion;} public void setDescripcion(String v){descripcion=v;} public BigDecimal getPrecio(){return precio;} public void setPrecio(BigDecimal v){precio=v;} public Integer getStock(){return stock;} public void setStock(Integer v){stock=v;} public Boolean getActivo(){return activo;} public void setActivo(Boolean v){activo=v;}
}
