import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:'root'})
export class ApiService { private http=inject(HttpClient); productos(){return this.http.get<any[]>('/api/productos');} catalogo(){return this.http.get<any[]>('/api/productos/catalogo');} crearProducto(p:any){return this.http.post('/api/productos',p);} clientes(){return this.http.get<any[]>('/api/clientes');} crearCliente(c:any){return this.http.post('/api/clientes',c);} ventas(){return this.http.get<any[]>('/api/ventas');} crearVenta(v:any){return this.http.post('/api/ventas',v);} }
