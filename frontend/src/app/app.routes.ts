import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CatalogoComponent } from './catalogo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: '**', redirectTo: 'catalogo' }
];
