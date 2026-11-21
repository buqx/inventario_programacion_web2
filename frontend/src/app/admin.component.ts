import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-heading">
      <div><span class="eyebrow">Panel principal</span><h1>Administración</h1><p>Gestiona productos, clientes, inventario y ventas.</p></div>
    </section>

    <section class="metric-grid">
      <article class="metric-card"><span class="metric-icon">▦</span><div><span>Productos registrados</span><strong>{{productos.length}}</strong></div></article>
      <article class="metric-card"><span class="metric-icon">◉</span><div><span>Clientes</span><strong>{{clientes.length}}</strong></div></article>
      <article class="metric-card"><span class="metric-icon">↗</span><div><span>Ventas realizadas</span><strong>{{ventas.length}}</strong></div></article>
    </section>

    <section class="metric-grid admin-forms">
      <article class="panel">
        <header class="panel-header"><h2>Nuevo producto</h2><span class="badge order">Inventario</span></header>
        <div class="panel-body">
          <form class="form-grid" (ngSubmit)="guardarProducto()">
            <div class="field full"><label>Nombre del producto</label><input [(ngModel)]="producto.nombre" name="nombre" placeholder="Ej. Monitor 27 pulgadas" required></div>
            <div class="field full"><label>Descripción</label><input [(ngModel)]="producto.descripcion" name="descripcion" placeholder="Descripción breve del producto"></div>
            <div class="field"><label>Precio COP</label><input [(ngModel)]="producto.precio" name="precio" type="number" min="0.01" step="0.01" placeholder="0" required></div>
            <div class="field"><label>Stock inicial</label><input [(ngModel)]="producto.stock" name="stock" type="number" min="0" placeholder="0" required></div>
            <div class="field full"><button class="primary-button" type="submit">Guardar producto</button></div>
          </form>
        </div>
      </article>

      <article class="panel">
        <header class="panel-header"><h2>Nuevo cliente</h2><span class="badge order">CRM</span></header>
        <div class="panel-body">
          <form class="form-grid" (ngSubmit)="guardarCliente()">
            <div class="field full"><label>Nombre completo</label><input [(ngModel)]="cliente.nombre" name="nombre" placeholder="Nombre del cliente" required></div>
            <div class="field full"><label>Correo electrónico</label><input [(ngModel)]="cliente.email" name="email" type="email" placeholder="cliente@email.com" required></div>
            <div class="field"><label>Teléfono</label><input [(ngModel)]="cliente.telefono" name="telefono" placeholder="300 000 0000"></div>
            <div class="field"><label>Dirección</label><input [(ngModel)]="cliente.direccion" name="direccion" placeholder="Dirección"></div>
            <div class="field full"><button class="primary-button" type="submit">Guardar cliente</button></div>
          </form>
        </div>
      </article>
    </section>

    <section class="panel" style="margin-bottom:20px">
      <header class="panel-header"><h2>Inventario de productos</h2><span class="badge ok">Actualizado</span></header>
      <div class="table-wrap">
        <table class="data-table"><thead><tr><th>Producto</th><th>Descripción</th><th>Precio</th><th>Disponibilidad</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of productos"><td><strong>{{p.nombre}}</strong></td><td>{{p.descripcion||'Sin descripción'}}</td><td><strong>{{p.precio|number:'1.0-0'}} COP</strong></td><td><span class="badge" [class.low]="p.stock<5" [class.ok]="p.stock>=5">{{p.stock}} unidades</span></td></tr>
            <tr *ngIf="productos.length===0"><td colspan="4">No hay productos registrados.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <header class="panel-header"><h2>Historial de ventas</h2><span class="badge order">{{ventas.length}} registros</span></header>
      <div class="table-wrap">
        <table class="data-table"><thead><tr><th>Factura</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr *ngFor="let v of ventas">
              <td><span class="badge order">{{v.factura?.numero||'—'}}</span></td>
              <td><strong>{{v.cliente?.nombre||'—'}}</strong></td>
              <td><span *ngFor="let d of v.detalles; let last=last"><strong>{{d.cantidad}}</strong> × {{d.producto}}<span *ngIf="!last">, </span></span></td>
              <td><strong>{{v.total|number:'1.0-0'}} COP</strong></td>
              <td>{{v.fecha|date:'dd/MM/yyyy, h:mm a'}}</td>
            </tr>
            <tr *ngIf="ventas.length===0"><td colspan="5">No hay ventas registradas.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="alert success" *ngIf="mensaje">{{mensaje}}</div>
    <div class="alert error" *ngIf="error">{{error}}</div>
  `,
  styles: [`.admin-forms{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:980px){.admin-forms{grid-template-columns:1fr}}`]
})
export class AdminComponent implements OnInit {
  private api=inject(ApiService);
  productos:any[]=[]; clientes:any[]=[]; ventas:any[]=[];
  mensaje=''; error='';
  producto:any={nombre:'',descripcion:'',precio:null,stock:null,activo:true};
  cliente:any={nombre:'',email:'',telefono:'',direccion:''};

  ngOnInit(){this.cargar();}

  cargar(){
    this.api.productos().subscribe({next:v=>this.productos=v,error:e=>this.error=e.error?.error||'Error de conexión'});
    this.api.clientes().subscribe({next:v=>this.clientes=v,error:e=>this.error=e.error?.error||'Error cargando clientes'});
    this.api.ventas().subscribe({next:v=>this.ventas=v,error:e=>this.error=e.error?.error||'Error cargando ventas'});
  }

  guardarProducto(){
    this.error='';this.mensaje='';
    this.api.crearProducto(this.producto).subscribe({next:()=>{
      this.mensaje='Producto guardado correctamente.';
      this.producto={nombre:'',descripcion:'',precio:null,stock:null,activo:true};
      this.cargar();
    },error:e=>this.error=e.error?.error||'Error creando producto'});
  }

  guardarCliente(){
    this.error='';this.mensaje='';
    this.api.crearCliente(this.cliente).subscribe({next:()=>{
      this.mensaje='Cliente guardado correctamente.';
      this.cliente={nombre:'',email:'',telefono:'',direccion:''};
      this.cargar();
    },error:e=>this.error=e.error?.error||'Error creando cliente'});
  }
}
