import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<nav><strong>Inventario Pro</strong><a routerLink="/admin" routerLinkActive="active">Administrador</a><a routerLink="/catalogo" routerLinkActive="active">Catálogo cliente</a></nav><main><router-outlet /></main>`,
  styles: [`nav{display:flex;gap:24px;align-items:center;padding:16px 32px;background:#111827;color:white}nav strong{margin-right:auto;font-size:20px}nav a{color:#cbd5e1;text-decoration:none}nav a.active{color:#38bdf8}main{max-width:1200px;margin:auto;padding:24px}`]
})
export class AppComponent {}
