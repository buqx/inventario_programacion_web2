package com.inventario.domain;
import java.math.BigDecimal;

 import com.fasterxml.jackson.annotation.JsonIgnore;

 import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity @Table(name="detalle_ventas")
public class DetalleVenta { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @JsonIgnore @ManyToOne(optional=false) private Venta venta; @ManyToOne(optional=false) private Producto producto; @Column(nullable=false) private Integer cantidad; @Column(nullable=false) private BigDecimal precioUnitario;
 public Long getId(){return id;} public void setId(Long v){id=v;} public Venta getVenta(){return venta;} public void setVenta(Venta v){venta=v;} public Producto getProducto(){return producto;} public void setProducto(Producto v){producto=v;} public Integer getCantidad(){return cantidad;} public void setCantidad(Integer v){cantidad=v;} public BigDecimal getPrecioUnitario(){return precioUnitario;} public void setPrecioUnitario(BigDecimal v){precioUnitario=v;}
}
