import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

interface ItemCarrito { producto:any; cantidad:number; }

@Component({
  standalone:true,
  imports:[CommonModule,FormsModule],
  template:`
    <section class="page-heading">
      <div><span class="eyebrow">Tienda</span><h1>Catálogo de productos</h1><p>Selecciona productos y define la cantidad disponible.</p></div>
      <span class="badge order">{{productos.length}} productos</span>
    </section>

    <div class="catalog-layout">
      <section>
        <div class="catalog-grid">
          <article class="product-card" *ngFor="let p of productos">
            <header>
              <span class="product-icon">{{inicial(p.nombre)}}</span>
              <span class="badge" [class.low]="p.stock<5" [class.ok]="p.stock>=5">{{p.stock}} disponibles</span>
            </header>
            <h2>{{p.nombre}}</h2>
            <p>{{p.descripcion||'Producto disponible en inventario.'}}</p>
            <strong class="product-price">{{p.precio|number:'1.0-0'}} <small>COP</small></strong>
            <div class="product-actions">
              <input class="quantity-input" type="number" min="1" [max]="p.stock" [(ngModel)]="cantidades[p.id]" [disabled]="p.stock<1" aria-label="Cantidad">
              <button class="primary-button" [disabled]="p.stock<1" (click)="agregar(p)">Agregar</button>
            </div>
          </article>
        </div>
        <div class="panel empty-state" *ngIf="productos.length===0"><span>◫</span><h2>No hay productos disponibles</h2><p>Los productos aparecerán aquí cuando tengan stock activo.</p></div>
      </section>

      <aside class="panel cart-panel">
        <header class="panel-header"><h2>Tu pedido</h2><span class="badge order">{{cantidadItems}} artículos</span></header>
        <div class="panel-body cart-body">
          <div class="empty-cart" *ngIf="carrito.length===0"><span>▱</span><strong>El carrito está vacío</strong><p>Agrega productos desde el catálogo.</p></div>

          <div class="cart-items" *ngIf="carrito.length>0">
            <article class="cart-item" *ngFor="let item of carrito">
              <div class="cart-item-main"><span class="mini-icon">{{inicial(item.producto.nombre)}}</span><div><strong>{{item.producto.nombre}}</strong><small>{{item.producto.precio|number:'1.0-0'}} COP c/u</small></div></div>
              <div class="cart-item-actions"><input class="quantity-input" type="number" min="1" [max]="item.producto.stock" [(ngModel)]="item.cantidad" (ngModelChange)="validarCantidad(item)" aria-label="Cantidad"><button class="danger-button" (click)="quitar(item)" aria-label="Quitar">×</button></div>
            </article>
          </div>

          <div class="checkout">
            <div class="field"><label>Cliente para la venta</label><select class="cart-select" [(ngModel)]="clienteId"><option [ngValue]="null">Seleccione un cliente</option><option *ngFor="let c of clientes" [ngValue]="c.id">{{c.nombre}}</option></select></div>
            <div class="total-row"><span>Total</span><strong>{{total|number:'1.0-0'}} COP</strong></div>
            <button class="primary-button checkout-button" [disabled]="carrito.length===0" (click)="confirmar()">Crear venta y factura</button>
          </div>
        </div>
      </aside>
    </div>

    <div class="alert success" *ngIf="mensaje">{{mensaje}}</div>
    <div class="alert error" *ngIf="error">{{error}}</div>
  `,
  styles:[`.catalog-layout{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:20px}.catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}.product-card{min-width:0;padding:18px;background:white;border:1px solid var(--border);border-radius:16px;box-shadow:0 8px 24px rgba(15,23,42,.045);transition:.2s}.product-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px rgba(15,23,42,.08)}.product-card header{display:flex;align-items:flex-start;justify-content:space-between}.product-icon,.mini-icon{display:grid;place-items:center;border-radius:12px;background:linear-gradient(135deg,#eff6ff,#dbeafe);color:var(--blue);font-family:'Manrope',sans-serif;font-weight:800}.product-icon{width:50px;height:50px;font-size:18px}.product-card h2{margin:16px 0 6px;font-family:'Manrope',sans-serif;font-size:17px}.product-card p{min-height:42px;margin:0;color:var(--muted);font-size:13px}.product-price{display:block;margin:15px 0;font-family:'Manrope',sans-serif;color:var(--ink);font-size:21px}.product-price small{color:var(--muted);font-size:10px}.product-actions{display:grid;grid-template-columns:82px 1fr;gap:8px}.cart-panel{height:max-content;position:sticky;top:96px}.cart-body{padding:0}.empty-cart{text-align:center;padding:35px 20px;color:var(--muted)}.empty-cart span{display:block;margin-bottom:8px;font-size:38px;color:#cbd5e1}.empty-cart strong{display:block;color:var(--ink)}.empty-cart p{margin:5px 0 0;font-size:12px}.cart-items{padding:8px 18px;max-height:360px;overflow-y:auto}.cart-item{padding:12px 0;border-bottom:1px solid #edf0f4}.cart-item:last-child{border-bottom:0}.cart-item-main{display:flex;align-items:center;gap:10px}.mini-icon{width:36px;height:36px}.cart-item-main strong,.cart-item-main small{display:block}.cart-item-main small{margin-top:3px;color:var(--muted)}.cart-item-actions{display:grid;grid-template-columns:82px 42px;justify-content:end;gap:8px;margin-top:8px}.cart-item-actions .quantity-input{height:36px}.cart-item-actions .danger-button{min-height:36px;padding:0}.checkout{display:grid;gap:14px;padding:18px;border-top:1px solid var(--border);background:#fbfdff;border-radius:0 0 18px 18px}.total-row{display:flex;justify-content:space-between;align-items:center}.total-row strong{font-family:'Manrope',sans-serif;font-size:20px}.checkout-button{width:100%}.empty-state{text-align:center;padding:48px}.empty-state span{font-size:38px;color:#94a3b8}.empty-state h2{margin:10px 0 4px}.empty-state p{color:var(--muted)}@media(max-width:980px){.catalog-layout{grid-template-columns:1fr}.cart-panel{position:static}.catalog-grid{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}@media(max-width:480px){.catalog-grid{grid-template-columns:1fr}.page-heading{display:block}.page-heading>.badge{display:inline-flex;margin-top:12px}}`]
})
export class CatalogoComponent implements OnInit {
  private api=inject(ApiService);
  productos:any[]=[]; clientes:any[]=[]; carrito:ItemCarrito[]=[];
  cantidades:{[productoId:number]:number}={}; clienteId:number|null=null; mensaje=''; error='';
  ngOnInit(){this.cargar();}
  inicial(nombre:string){return (nombre||'P').trim().charAt(0).toUpperCase();}
  cargar(){this.api.catalogo().subscribe({next:v=>{this.productos=v;for(const p of v)if(!this.cantidades[p.id])this.cantidades[p.id]=1},error:e=>this.error=e.error?.error||'Error de conexión'});this.api.clientes().subscribe({next:v=>this.clientes=v,error:e=>this.error=e.error?.error||'Error cargando clientes'});}
  get cantidadItems(){return this.carrito.reduce((sum,item)=>sum+item.cantidad,0)}
  get total(){return this.carrito.reduce((sum,item)=>sum+Number(item.producto.precio)*item.cantidad,0)}
  agregar(p:any){const cantidad=Number(this.cantidades[p.id]||1);if(cantidad<1){this.error='La cantidad mínima es 1';return}if(cantidad>p.stock){this.error='La cantidad no puede superar el stock disponible';return}const existente=this.carrito.find(item=>item.producto.id===p.id);if(existente){existente.cantidad=Number(existente.cantidad)+cantidad;if(existente.cantidad>p.stock)existente.cantidad=p.stock}else this.carrito.push({producto:p,cantidad});this.error='';this.mensaje=p.nombre+' agregado al pedido.'}
  validarCantidad(item:ItemCarrito){let cantidad=Number(item.cantidad);if(!Number.isInteger(cantidad)||cantidad<1)cantidad=1;if(cantidad>item.producto.stock)cantidad=item.producto.stock;item.cantidad=cantidad}
  quitar(item:ItemCarrito){this.carrito=this.carrito.filter(v=>v!==item);this.mensaje='Producto retirado del pedido.'}
  confirmar(){if(!this.clienteId){this.error='Seleccione un cliente para continuar';return}if(!this.carrito.length){this.error='Agregue al menos un producto';return}const items=this.carrito.map(item=>({productoId:item.producto.id,cantidad:item.cantidad}));this.error='';this.mensaje='';this.api.crearVenta({clienteId:this.clienteId,items}).subscribe({next:(v:any)=>{this.mensaje='Venta registrada correctamente. Factura '+v.factura.numero;this.carrito=[];this.cargar()},error:(e:any)=>this.error=e.error?.error||'No fue posible completar la venta'})}
}
