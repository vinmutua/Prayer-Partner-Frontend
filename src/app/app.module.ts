import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth-interceptor.function';
import { ErrorInterceptor } from './interceptors/error-interceptor.function';
import { TunnelBypassInterceptor } from './interceptors/tunnel-bypass.interceptor';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CoreModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    { provide: HTTP_INTERCEPTORS, useClass: TunnelBypassInterceptor, multi: true }
  ]
})
export class AppModule { }
