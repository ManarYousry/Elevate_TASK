import { Routes } from '@angular/router';
import { auth_routes } from './features/auth/auth.routes';

export const routes: Routes = [
 ...auth_routes,
  {
    path: '**',
    redirectTo: 'login'
  }
];
