import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, ApiResponse, AuthData } from '../types/api.types';

// Re-export the User type for convenience
export type { User };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      if (this.jwtHelper.isTokenExpired(token) && refreshToken) {
        this.refreshToken().subscribe();
      } else if (!this.jwtHelper.isTokenExpired(token)) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(email: string, password: string): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  register(userData: { email: string; password: string; firstName: string; lastName: string }): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }

  refreshToken(): Observable<{ token: string }> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.refreshTokenSubject.subscribe(token => {
          if (token) {
            observer.next({ token });
            observer.complete();
          }
        });
      });
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap((response: ApiResponse<AuthData>) => {
        this.refreshTokenInProgress = false;

        if (response.success && response.data) {
          this.refreshTokenSubject.next(response.data.token);
          localStorage.setItem('token', response.data.token);

          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }

          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
          }
        }
      }),
      switchMap(response => {
        if (response.success && response.data) {
          return of({ token: response.data.token });
        }
        return throwError(() => new Error('Failed to refresh token'));
      }),
      catchError(error => {
        this.refreshTokenInProgress = false;
        this.logout();
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token) return false;

    if (this.jwtHelper.isTokenExpired(token)) {
      if (refreshToken) {
        this.refreshToken().subscribe();
        return true;
      }
      return false;
    }

    return true;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
