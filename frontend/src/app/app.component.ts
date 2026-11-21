import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" routerLink="/catalogo" aria-label="Inicio">
          <span class="brand-mark">I</span>
          <span>
            <strong>Inventario</strong>
            <small>Gestión comercial</small>
          </span>
        </a>

        <nav class="main-nav" aria-label="Navegación principal">
          <a routerLink="/admin" routerLinkActive="active">
            <span class="nav-icon">▦</span>
            <span>Administración</span>
          </a>
          <a routerLink="/catalogo" routerLinkActive="active">
            <span class="nav-icon">⌂</span>
            <span>Catálogo</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <span class="status-dot"></span>
          Sistema operativo
        </div>
      </aside>

      <div class="page-shell">
        <header class="topbar">
          <div>
            <span class="topbar-eyebrow">Centro de operaciones</span>
            <strong>Inventario Pro</strong>
          </div>
          <div class="topbar-actions">
            <span class="avatar">A</span>
            <span class="user-copy"><strong>Administrador</strong><small>Acceso activo</small></span>
          </div>
        </header>
        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {}
