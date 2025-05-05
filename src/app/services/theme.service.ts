import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PrayerTheme, ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = `${environment.apiUrl}/themes`;

  constructor(private http: HttpClient) {}

  // Get all themes
  getAllThemes(): Observable<PrayerTheme[]> {
    return this.http.get<ApiResponse<PrayerTheme[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching themes:', error);
          throw error;
        })
      );
  }

  // Get active themes
  getActiveThemes(): Observable<PrayerTheme[]> {
    return this.http.get<ApiResponse<PrayerTheme[]>>(`${this.apiUrl}/active`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching active themes:', error);
          throw error;
        })
      );
  }

  // Get theme by ID
  getThemeById(id: number): Observable<PrayerTheme> {
    return this.http.get<ApiResponse<PrayerTheme>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Theme not found');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error fetching theme ${id}:`, error);
          throw error;
        })
      );
  }

  // Create new theme
  createTheme(themeData: {
    title: string;
    description: string;
    active: boolean;
  }): Observable<PrayerTheme> {
    return this.http.post<ApiResponse<PrayerTheme>>(`${this.apiUrl}`, themeData)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to create theme');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error creating theme:', error);
          throw error;
        })
      );
  }

  // Update theme
  updateTheme(id: number, themeData: {
    title?: string;
    description?: string;
    active?: boolean;
  }): Observable<PrayerTheme> {
    return this.http.put<ApiResponse<PrayerTheme>>(`${this.apiUrl}/${id}`, themeData)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to update theme');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error updating theme ${id}:`, error);
          throw error;
        })
      );
  }

  // Delete theme
  deleteTheme(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
