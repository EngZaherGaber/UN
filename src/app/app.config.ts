import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterLink } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { MyPreset } from '../../public/mytheme';
import { MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler, provideHttpClient, withInterceptors } from '@angular/common/http';
import { generalInterceptor } from './general/interceptor/general.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {},
      },
    }),
    MessageService,
    provideHttpClient(),
    provideAnimations(),
    provideHttpClient(withInterceptors([generalInterceptor]))
  ],
};
