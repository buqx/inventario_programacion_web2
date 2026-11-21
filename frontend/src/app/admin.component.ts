import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="page-heading"><div><span class="eyebrow">Panel principal</span><h1>Administración</h1><p>Gestiona productos, clientes, inventario y ventas.</p></div></section>

    <section class="metric-grid">
      <article class="metric-card"><span class="metric-icon">▦</span><div><span>Productos registrados</span><strong>{{productos.length}}</strong></div></article>
      <article class="metric-card"><span class="metric-icon">◉</span><div><span>Clientes</span><strong>{{clientes.length}}</strong></div></article>
      <article class="metric-card"><span class="metric-icon">↗</span><div><span>Ventas realizadas</span><strong>{{ventas.length}}</strong></div></article>
    </section>

    <section class="metric-grid admin-forms">
      <article class="panel">
        <header class="panel-header"><h2>{{editandoProductoId ? 'Editar producto' : 'Nuevo producto'}}</h2><span class="badge order">Inventario</span></header>
        <div class="panel-body">
          <form class="form-grid" (ngSubmit)="guardarProducto()">
            <div class="field full"><label>Nombre del producto</label><input [(ngModel)]="producto.nombre" name="nombre" placeholder="Ej. Monitor 27 pulgadas" required></div>
            <div class="field full"><label>Descripción</label><input [(ngModel)]="producto.descripcion" name="descripcion" placeholder="Descripción breve del producto"></div>
            <div class="field"><label>Precio COP</label><input [(ngModel)]="producto.precio" name="precio" type="number" min="0.01" step="0.01" placeholder="0" required></div>
            <div class="field"><label>Stock disponible</label><input [(ngModel)]="producto.stock" name="stock" type="number" min="0" placeholder="0" required></div>
            <div class="field full form-actions"><button class="primary-button" type="submit">{{editandoProductoId ? 'Guardar cambios' : 'Guardar producto'}}</button><button *ngIf="editandoProductoId" class="secondary-button" type="button" (click)="cancelarProducto()">Cancelar</button></div>
          </form>
        </div>
      </article>

      <article class="panel">
        <header class="panel-header"><h2>{{editandoClienteId ? 'Editar cliente' : 'Nuevo cliente'}}</h2><span class="badge order">CRM</span></header>
        <div class="panel-body">
          <form class="form-grid" (ngSubmit)="guardarCliente()">
            <div class="field full"><label>Nombre completo</label><input [(ngModel)]="cliente.nombre" name="nombre" placeholder="Nombre del cliente" required></div>
            <div class="field full"><label>Correo electrónico</label><input [(ngModel)]="cliente.email" name="email" type="email" placeholder="cliente@email.com" required></div>
            <div class="field"><label>Teléfono</label><input [(ngModel)]="cliente.telefono" name="telefono" placeholder="300 000 0000"></div>
            <div class="field"><label>Dirección</label><input [(ngModel)]="cliente.direccion" name="direccion" placeholder="Dirección"></div>
            <div class="field full form-actions"><button class="primary-button" type="submit">{{editandoClienteId ? 'Guardar cambios' : 'Guardar cliente'}}</button><button *ngIf="editandoClienteId" class="secondary-button" type="button" (click)="cancelarCliente()">Cancelar</button></div>
          </form>
        </div>
      </article>
    </section>

    <section class="panel" style="margin-bottom:20px">
      <header class="panel-header"><h2>Inventario de productos</h2><span class="badge ok">Actualizado</span></header>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Producto</th><th>Descripción</th><th>Precio</th><th>Disponibilidad</th><th class="actions-column">Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let p of productos"><td><strong>{{p.nombre}}</strong></td><td>{{p.descripcion||'Sin descripción'}}</td><td><strong>{{p.precio|number:'1.0-0'}} COP</strong></td><td><span class="badge" [class.low]="p.stock<5" [class.ok]="p.stock>=5">{{p.stock}} unidades</span></td><td><div class="row-actions"><button class="secondary-button compact" (click)="editarProducto(p)">Editar</button><button class="danger-button compact" (click)="eliminarProducto(p)">Eliminar</button></div></td></tr>
          <tr *ngIf="productos.length===0"><td colspan="5">No hay productos registrados.</td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="panel" style="margin-bottom:20px">
      <header class="panel-header"><h2>Clientes registrados</h2><span class="badge order">{{clientes.length}} registros</span></header>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Cliente</th><th>Correo electrónico</th><th>Teléfono</th><th>Dirección</th><th class="actions-column">Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of clientes"><td><strong>{{c.nombre}}</strong></td><td>{{c.email||'—'}}</td><td>{{c.telefono||'—'}}</td><td>{{c.direccion||'—'}}</td><td><div class="row-actions"><button class="secondary-button compact" (click)="editarCliente(c)">Editar</button><button class="danger-button compact" (click)="eliminarCliente(c)">Eliminar</button></div></td></tr>
          <tr *ngIf="clientes.length===0"><td colspan="5">No hay clientes registrados.</td></tr>
        </tbody>
      </table></div>
    </section>

    <section class="panel">
      <header class="panel-header"><h2>Historial de ventas</h2><span class="badge order">{{ventas.length}} registros</span></header>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Factura</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Fecha y hora local</th><th class="actions-column">Acciones</th></tr></thead>
        <tbody>
          <tr *ngFor="let v of ventas"><td><span class="badge order">{{v.factura?.numero||'—'}}</span></td><td><strong>{{v.cliente?.nombre||'—'}}</strong></td><td><span *ngFor="let d of v.detalles; let last=last"><strong>{{d.cantidad}}</strong> × {{d.producto}}<span *ngIf="!last">, </span></span></td><td><strong>{{v.total|number:'1.0-0'}} COP</strong></td><td>{{formatearFechaLocal(v.fecha)}}</td><td><button class="danger-button compact" (click)="eliminarVenta(v)">Eliminar</button></td></tr>
          <tr *ngIf="ventas.length===0"><td colspan="6">No hay ventas registradas.</td></tr>
        </tbody>
      </table></div>
    </section>

    <div class="alert success" *ngIf="mensaje">{{mensaje}}</div><div class="alert error" *ngIf="error">{{error}}</div>
  `,
  styles:[`.admin-forms{grid-template-columns:repeat(2,minmax(0,1fr))}.form-actions{display:flex;gap:8px}.row-actions{display:flex;gap:6px}.compact{min-height:34px;padding:0 10px;font-size:12px}.actions-column{width:150px}@media(max-width:980px){.admin-forms{grid-template-columns:1fr}}`]
})
export class AdminComponent implements OnInit {
  private api=inject(ApiService);
  productos:any[]=[]; clientes:any[]=[]; ventas:any[]=[];
  mensaje=''; error='';
  editandoProductoId:number|null=null; editandoClienteId:number|null=null;
  producto:any={nombre:'',descripcion:'',precio:null,stock:null,activo:true};
  cliente:any={nombre:'',email:'',telefono:'',direccion:''};

  ngOnInit(){this.cargar();}

  cargar(){
    this.error='';
    this.api.productos().subscribe({next:v=>this.productos=v,error:e=>this.error=e.error?.error||'Error de conexión'});
    this.api.clientes().subscribe({next:v=>this.clientes=v,error:e=>this.error=e.error?.error||'Error cargando clientes'});
    this.api.ventas().subscribe({next:v=>this.ventas=v,error:e=>this.error=e.error?.error||'Error cargando ventas'});
  }

  formatearFechaLocal(fecha:string):string { if(!fecha)return '—'; const date=new Date(fecha); return isNaN(date.getTime())?fecha:date.toLocaleString(undefined,{dateStyle:'short',timeStyle:'medium'}); }

  guardarProducto(){
    this.error='';this.mensaje='';
    const request=this.editandoProductoId ? this.api.actualizarProducto(this.editandoProductoId,this.producto) : this.api.crearProducto(this.producto);
    request.subscribe({next:()=>{this.mensaje=this.editandoProductoId?'Producto actualizado correctamente.':'Producto guardado correctamente.';this.cancelarProducto();this.cargar()},error:e=>this.error=e.error?.error||'Error guardando producto'});
  }
  editarProducto(p:any){this.editandoProductoId=p.id;this.producto={nombre:p.nombre,descripcion:p.descripcion,precio:p.precio,stock:p.stock,activo:p.activo};window.scrollTo({top:0,behavior:'smooth'});}
  cancelarProducto(){this.editandoProductoId=null;this.producto={nombre:'',descripcion:'',precio:null,stock:null,activo:true};}
  eliminarProducto(p:any){if(!confirm('¿Eliminar el producto "'+p.nombre+'"?'))return;this.api.eliminarProducto(p.id).subscribe({next:()=>{this.mensaje='Producto eliminado correctamente.';this.cargar()},error:e=>this.error=e.error?.error||'No fue posible eliminar el producto'});}

  guardarCliente(){
    this.error='';this.mensaje='';
    const request=this.editandoClienteId ? this.api.actualizarCliente(this.editandoClienteId,this.cliente) : this.api.crearCliente(this.cliente);
    request.subscribe({next:()=>{this.mensaje=this.editandoClienteId?'Cliente actualizado correctamente.':'Cliente guardado correctamente.';this.cancelarCliente();this.cargar()},error:e=>this.error=e.error?.error||'Error guardando cliente'});
  }
  editarCliente(c:any){this.editandoClienteId=c.id;this.cliente={nombre:c.nombre,email:c.email,telefono:c.telefono,direccion:c.direccion};window.scrollTo({top:0,behavior:'smooth'});}
  cancelarCliente(){this.editandoClienteId=null;this.cliente={nombre:'',email:'',telefono:'',direccion:''};}
  eliminarCliente(c:any){if(!confirm('¿Eliminar al cliente "'+c.nombre+'"?'))return;this.api.eliminarCliente(c.id).subscribe({next:()=>{this.mensaje='Cliente eliminado correctamente.';this.cargar()},error:e=>this.error=e.error?.error||'No fue posible eliminar el cliente'});}

  eliminarVenta(v:any){if(!confirm('¿Eliminar esta venta? El stock de sus productos será restaurado.'))return;this.api.eliminarVenta(v.id).subscribe({next:()=>{this.mensaje='Venta eliminada y stock restaurado.';this.cargar()},error:e=>this.error=e.error?.error||'No fue posible eliminar la venta'});}
}

