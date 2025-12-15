import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private authApiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/all`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching users:', error);
          throw error;
        })
      );
  }

  // Create user (admin only)
  createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'MEMBER';
    active: boolean;
  }): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.authApiUrl}/register`, userData)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to create user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error creating user:', error);
          throw error;
        })
      );
  }

  // Update user (admin only)
  updateUser(id: number, userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'MEMBER';
    active?: boolean;
    password?: string;
  }): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to update user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error updating user ${id}:`, error);
          throw error;
        })
      );
  }

  // Delete user (admin only)
  deleteUser(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.authApiUrl}/me`)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to get current user');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error fetching current user:', error);
          throw error;
        })
      );
  }

  // Update current user's own profile (non-admin)
  updateOwnProfile(userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
  }): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.authApiUrl}/profile`, userData)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to update profile');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error updating profile:', error);
          throw error;
        })
      );
  }
}
