import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  standalone:true,
  imports:[CommonModule,FormsModule],
  template:`
    <h1>Panel administrativo</h1>
    <div class="grid">
      <section><h2>Nuevo producto</h2>
        <form (ngSubmit)="guardarProducto()">
          <input [(ngModel)]="producto.nombre" name="nombre" placeholder="Nombre" required>
          <input [(ngModel)]="producto.descripcion" name="descripcion" placeholder="Descripción">
          <input [(ngModel)]="producto.precio" name="precio" type="number" min="0.01" step="0.01" placeholder="Precio" required>
          <input [(ngModel)]="producto.stock" name="stock" type="number" min="0" placeholder="Stock" required>
          <button>Guardar producto</button>
        </form>
      </section>
      <section><h2>Nuevo cliente</h2>
        <form (ngSubmit)="guardarCliente()">
          <input [(ngModel)]="cliente.nombre" name="nombre" placeholder="Nombre" required>
          <input [(ngModel)]="cliente.email" name="email" type="email" placeholder="Email" required>
          <input [(ngModel)]="cliente.telefono" name="telefono" placeholder="Teléfono">
          <input [(ngModel)]="cliente.direccion" name="direccion" placeholder="Dirección">
          <button>Guardar cliente</button>
        </form>
      </section>
    </div>

    <h2>Inventario</h2>
    <table><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th></tr></thead>
      <tbody><tr *ngFor="let p of productos"><td>{{p.nombre}}</td><td>{{p.precio|number:'1.0-0'}}</td><td [class.low]="p.stock<5">{{p.stock}}</td></tr></tbody>
    </table>

    <h2>Ventas</h2>
    <table><thead><tr><th>Factura</th><th>Cliente</th><th>Productos y cantidades</th><th>Total</th><th>Fecha</th></tr></thead>
      <tbody>
        <tr *ngFor="let v of ventas">
          <td>{{v.factura?.numero||'—'}}</td>
          <td>{{v.cliente?.nombre||'—'}}</td>
          <td><div *ngFor="let d of v.detalles">{{d.cantidad}} × {{d.producto}}</div></td>
          <td>{{v.total|number:'1.0-0'}}</td>
          <td>{{v.fecha|date:'short'}}</td>
        </tr>
      </tbody>
    </table>
    <p class="error" *ngIf="error">{{error}}</p>
  `,
  styles:[`.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}section,table{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px}form{display:grid;gap:10px}input{padding:10px;border:1px solid #d1d5db;border-radius:8px}button{padding:10px;border:0;border-radius:8px;background:#2563eb;color:white}table{width:100%;border-collapse:collapse;margin-bottom:24px}td,th{padding:10px;border-bottom:1px solid #eee;text-align:left}.low{color:#dc2626;font-weight:bold}.error{color:#dc2626}@media(max-width:700px){.grid{grid-template-columns:1fr}}`]
})
export class AdminComponent implements OnInit {
  private api=inject(ApiService);
  productos:any[]=[]; ventas:any[]=[]; error='';
  producto:any={nombre:'',descripcion:'',precio:null,stock:null,activo:true};
  cliente:any={nombre:'',email:'',telefono:'',direccion:''};

  ngOnInit(){this.cargar();}

  cargar(){
    this.api.productos().subscribe({next:v=>this.productos=v,error:e=>this.error=e.error?.error||'Error de conexión'});
    this.api.ventas().subscribe({next:v=>this.ventas=v,error:e=>this.error=e.error?.error||'Error cargando ventas'});
  }

  guardarProducto(){
    this.api.crearProducto(this.producto).subscribe({next:()=>{
      this.producto={nombre:'',descripcion:'',precio:null,stock:null,activo:true};
      this.cargar();
    }, error:e=>this.error=e.error?.error||'Error creando producto'});
  }

  guardarCliente(){
    this.api.crearCliente(this.cliente).subscribe({next:()=>{
      this.cliente={nombre:'',email:'',telefono:'',direccion:''};
      this.cargar();
    }, error:e=>this.error=e.error?.error||'Error creando cliente'});
  }
}
