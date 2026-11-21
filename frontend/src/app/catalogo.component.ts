import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

interface ItemCarrito {
  producto: any;
  cantidad: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Catálogo disponible</h1>
    <div class="layout">
      <div class="cards">
        <article *ngFor="let p of productos">
          <h3>{{p.nombre}}</h3>
          <p>{{p.descripcion}}</p>
          <strong>{{p.precio|number:'1.0-0'}} COP</strong>
          <small>Stock disponible: {{p.stock}}</small>
          <div class="agregar">
            <input type="number" min="1" [max]="p.stock" [(ngModel)]="cantidades[p.id]" [disabled]="p.stock<1">
            <button [disabled]="p.stock<1" (click)="agregar(p)">Agregar</button>
          </div>
        </article>
      </div>

      <aside>
        <h2>Carrito</h2>
        <p *ngIf="carrito.length===0">El carrito está vacío.</p>
        <div class="item" *ngFor="let item of carrito">
          <strong>{{item.producto.nombre}}</strong>
          <input type="number" min="1" [max]="item.producto.stock" [(ngModel)]="item.cantidad" (ngModelChange)="validarCantidad(item)">
          <button class="quitar" (click)="quitar(item)">Quitar</button>
        </div>

        <label>Cliente</label>
        <select [(ngModel)]="clienteId">
          <option [ngValue]="null">Seleccione cliente</option>
          <option *ngFor="let c of clientes" [ngValue]="c.id">{{c.nombre}}</option>
        </select>
        <strong class="total">Total: {{total|number:'1.0-0'}} COP</strong>
        <button class="comprar" [disabled]="carrito.length===0" (click)="confirmar()">Crear venta y factura</button>
      </aside>
    </div>

    <p class="ok" *ngIf="mensaje">{{mensaje}}</p>
    <p class="error" *ngIf="error">{{error}}</p>
  `,
  styles: [`.layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:20px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}article,aside{background:white;border:1px solid #e5e7eb;border-radius:14px;padding:18px}article{display:grid;gap:8px}.agregar,.item{display:flex;gap:8px;align-items:center}.agregar input,.item input{width:75px}aside{height:max-content;display:grid;gap:12px}input,select,button{padding:10px;border-radius:8px}input,select{border:1px solid #d1d5db}button{border:0;background:#2563eb;color:white}.quitar{background:#ef4444}.comprar{width:100%}.total{color:#2563eb;font-size:18px}.error{color:#dc2626}.ok{color:#15803d}@media(max-width:800px){.layout{grid-template-columns:1fr}}`]
})
export class CatalogoComponent implements OnInit {
  private api = inject(ApiService);
  productos: any[]=[];
  clientes: any[]=[];
  carrito: ItemCarrito[]=[];
  cantidades: {[productoId: number]: number}={};
  clienteId: number|null=null;
  mensaje='';
  error='';

  ngOnInit(){this.cargar();}

  cargar(){
    this.api.catalogo().subscribe({next:v=>{
      this.productos=v;
      for(const p of v){ if(!this.cantidades[p.id]) this.cantidades[p.id]=1; }
    }, error:e=>this.error=e.error?.error||'Error de conexión'});
    this.api.clientes().subscribe(v=>this.clientes=v);
  }

  agregar(p:any){
    const cantidad=Number(this.cantidades[p.id]||1);
    if(cantidad<1){this.error='La cantidad mínima es 1';return;}
    if(cantidad>p.stock){this.error='La cantidad no puede superar el stock disponible';return;}

    const existente=this.carrito.find(item=>item.producto.id===p.id);
    if(existente){
      existente.cantidad=Number(existente.cantidad)+cantidad;
      this.validarCantidad(existente);
    } else {
      this.carrito.push({producto:p,cantidad});
    }
    this.error='';
  }

  validarCantidad(item:ItemCarrito){
    let cantidad=Number(item.cantidad);
    if(!Number.isInteger(cantidad)||cantidad<1) cantidad=1;
    if(cantidad>item.producto.stock) cantidad=item.producto.stock;
    item.cantidad=cantidad;
  }

  quitar(item:ItemCarrito){
    this.carrito=this.carrito.filter(v=>v!==item);
  }

  get total():number {
    return this.carrito.reduce((s,item)=>s+Number(item.producto.precio)*item.cantidad,0);
  }

  confirmar(){
    if(!this.clienteId){this.error='Seleccione un cliente';return;}
    if(this.carrito.length===0){this.error='Agregue al menos un producto';return;}

    const items=this.carrito.map(item=>({productoId:item.producto.id,cantidad:item.cantidad}));
    this.api.crearVenta({clienteId:this.clienteId,items}).subscribe({
      next:(v:any)=>{
        this.mensaje='Venta registrada. Factura '+v.factura.numero;
        this.carrito=[];
        this.cargar();
      },
      error:(e:any)=>this.error=e.error?.error||'No fue posible completar la venta'
    });
  }
}
