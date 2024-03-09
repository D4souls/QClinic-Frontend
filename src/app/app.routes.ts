import { Routes } from '@angular/router';
import { JWTGuard } from './core/guards/JWTGuard.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [JWTGuard],
    loadChildren: () => import('./pages/pages.routes').then(m => m.page_routes),
  },
  {
    path: 'login',
    title: 'Login QClinic',
    component: LoginComponent,
  },

];
