package com.inventario.domain;
import com.fasterxml.jackson.annotation.JsonIgnore; import jakarta.persistence.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity @Table(name="facturas")
public class Factura { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(unique=true,nullable=false) private String numero; @JsonIgnore @OneToOne(optional=false) private Venta venta; @Column(nullable=false) private LocalDateTime emitida=LocalDateTime.now(); @Column(nullable=false) private BigDecimal total;
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getNumero(){return numero;} public void setNumero(String v){numero=v;} public Venta getVenta(){return venta;} public void setVenta(Venta v){venta=v;} public LocalDateTime getEmitida(){return emitida;} public void setEmitida(LocalDateTime v){emitida=v;} public BigDecimal getTotal(){return total;} public void setTotal(BigDecimal v){total=v;}
}
