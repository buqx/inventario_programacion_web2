import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';

@Component({
  standalone:true,
  imports:[CommonModule, FormsModule],
  template:`<h1>Catálogo disponible</h1><div class="cards"><article *ngFor="let p of productos"><h3>{{p.nombre}}</h3><p>{{p.descripcion}}</p><strong>{{p.precio|number:'1.0-0'}} COP</strong><small>Stock: {{p.stock}}</small><button [disabled]="p.stock<1" (click)="comprar(p)">Comprar</button></article></div><div class="venta" *ngIf="producto"><h2>Confirmar compra</h2><select [(ngModel)]="clienteId"><option [ngValue]="null">Seleccione cliente</option><option *ngFor="let c of clientes" [ngValue]="c.id">{{c.nombre}}</option></select><button (click)="confirmar()">Crear venta y factura</button></div><p class="ok" *ngIf="mensaje">{{mensaje}}</p><p class="error" *ngIf="error">{{error}}</p>`,
  styles:[`.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}article{background:white;border:1px solid #e5e7eb;border-radius:14px;padding:18px;display:grid;gap:8px}.venta{margin-top:20px;padding:16px;background:#eff6ff;border-radius:12px}button,select{padding:10px;border-radius:8px}button{border:0;background:#2563eb;color:white}.error{color:#dc2626}.ok{color:#15803d}`]
})
export class CatalogoComponent implements OnInit {
  private api=inject(ApiService);
  productos:any[]=[]; clientes:any[]=[]; producto:any=null; clienteId:any=null; mensaje=''; error='';
  ngOnInit(){this.cargar();}
  cargar(){this.api.catalogo().subscribe({next:v=>this.productos=v,error:e=>this.error=e.error?.error||'Error de conexión'});this.api.clientes().subscribe(v=>this.clientes=v);}
  comprar(p:any){this.producto=p;this.mensaje='';this.error='';}
  confirmar(){
    if(!this.clienteId){this.error='Seleccione un cliente';return;}
    this.api.crearVenta({clienteId:this.clienteId,items:[{productoId:this.producto.id,cantidad:1}]}).subscribe({
      next:(v:any)=>{this.mensaje='Venta registrada. Factura '+v.factura.numero;this.cargar();},
      error:(e:any)=>this.error=e.error?.error||'No fue posible completar la venta'
    });
  }
}
