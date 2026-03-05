import { Routes } from '@angular/router';

export const auth_routes: Routes = [
   // redirect لو دخل على root
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // layout route
  {
    path: '',
    loadComponent: () =>
      import('../../layout/auth-layout/auth-layout')
        .then(m => m.AuthLayout),
    children: [

      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login')
            .then(m => m.Login),
      },

      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register')
            .then(m => m.Register),
      },

      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/forget-password/forget-password')
            .then(m => m.ForgetPassword),
      },
       { path: 'create-password', loadComponent: () =>
          import('./components/create-password/create-password')
            .then(m => m.CreatePassword),
      },
      { path: 'verify-otp', loadComponent: () =>
          import('./components/verify-otp/verify-otp')
            .then(m => m.VerifyOTP),
      },

    ]
  }


];
