import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class TunnelBypassInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add the header if using a localtunnel URL
    if (environment.apiUrl.includes('.loca.lt')) {
      const cloned = req.clone({
        setHeaders: { 'bypass-tunnel-reminder': 'true' }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}