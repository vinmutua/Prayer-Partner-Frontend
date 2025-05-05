import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth-interceptor.function';
import { ErrorInterceptor } from './interceptors/error-interceptor.function';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideAnimations(),
    importProvidersFrom(CoreModule, SharedModule)
  ]
};
