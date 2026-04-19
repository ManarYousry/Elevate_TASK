import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuth } from '../../dist/auth';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(routes),
      provideHttpClient(
         withInterceptors([authInterceptor])
      ),
      provideAuth({ apiUrl: environment.apiUrl }),
     provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
   
    providePrimeNG({
            theme: {

        preset: Aura,
        options: {
             cssLayer: {
        name: 'primeng',
        order:  'tailwind, primeng',
      }

        },


            }
        })
  ]
};
