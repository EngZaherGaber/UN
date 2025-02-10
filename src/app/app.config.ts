import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterLink } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { MyPreset } from '../../public/mytheme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { generalInterceptor } from './general/interceptor/general.interceptor';
import { AdTemplateComponent } from './admin/components/ad-template/ad-template.component';
import { DynmaicFormComponent } from './general/components/dynmaic-form/dynmaic-form.component';
import { DynamicTableComponent } from './general/components/dynamic-table/dynamic-table.component';
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
    ConfirmationService,
    provideHttpClient(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    AdTemplateComponent,
    DynmaicFormComponent,
    DynamicTableComponent,
    { provide: HTTP_INTERCEPTORS, useClass: generalInterceptor, multi: true }
  ],
};
