import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token refresh for auth endpoints
  if (req.url.includes(`${environment.apiUrl}/auth/refresh-token`)) {
    return next(req);
  }

  const token = authService.getToken();

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handleUnauthorizedError(req, next, authService);
      }
      return throwError(() => error);
    })
  ) as Observable<HttpEvent<unknown>>;
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handleUnauthorizedError(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  return authService.refreshToken().pipe(
    switchMap((response) => {
      return next(addToken(req, response.token));
    }),
    catchError((error) => {
      // If refresh token fails, log out the user
      authService.logout();
      return throwError(() => error);
    })
  );
}
