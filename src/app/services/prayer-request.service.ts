import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PrayerRequest, ApiResponse } from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class PrayerRequestService {
  private apiUrl = `${environment.apiUrl}/prayer-requests`;

  constructor(private http: HttpClient) {}

  // Get all prayer requests (admin only)
  getAllPrayerRequests(): Observable<PrayerRequest[]> {
    return this.http.get<ApiResponse<PrayerRequest[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching prayer requests:', error);
          throw error;
        })
      );
  }

  // Get active prayer requests (admin only)
  getActivePrayerRequests(): Observable<PrayerRequest[]> {
    return this.http.get<ApiResponse<PrayerRequest[]>>(`${this.apiUrl}/active`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching active prayer requests:', error);
          throw error;
        })
      );
  }

  // Get current user's prayer requests
  getMyPrayerRequests(): Observable<PrayerRequest[]> {
    return this.http.get<ApiResponse<PrayerRequest[]>>(`${this.apiUrl}/my-requests`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching my prayer requests:', error);
          throw error;
        })
      );
  }

  // Get current user's active prayer request
  getCurrentPrayerRequest(): Observable<PrayerRequest | null> {
    return this.http.get<ApiResponse<PrayerRequest | null>>(`${this.apiUrl}/current`)
      .pipe(
        map(response => response.data || null),
        catchError(error => {
          console.error('Error fetching current prayer request:', error);
          throw error;
        })
      );
  }

  // Create a new prayer request
  createPrayerRequest(data: { content: string }): Observable<PrayerRequest> {
    return this.http.post<ApiResponse<PrayerRequest>>(`${this.apiUrl}`, data)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to create prayer request');
          }
          return response.data;
        }),
        catchError(error => {
          console.error('Error creating prayer request:', error);
          throw error;
        })
      );
  }

  // Update a prayer request
  updatePrayerRequest(id: number, data: { content?: string; isActive?: boolean }): Observable<PrayerRequest> {
    return this.http.put<ApiResponse<PrayerRequest>>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Failed to update prayer request');
          }
          return response.data;
        }),
        catchError(error => {
          console.error(`Error updating prayer request ${id}:`, error);
          throw error;
        })
      );
  }

  // Delete a prayer request
  deletePrayerRequest(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Admin: Get prayer requests for a specific user
  getUserPrayerRequests(userId: number): Observable<PrayerRequest[]> {
    return this.http.get<ApiResponse<PrayerRequest[]>>(`${this.apiUrl}/user/${userId}`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error(`Error fetching prayer requests for user ${userId}:`, error);
          throw error;
        })
      );
  }

  // Admin: Get current prayer request for a specific user
  getUserCurrentPrayerRequest(userId: number): Observable<PrayerRequest | null> {
    return this.http.get<ApiResponse<PrayerRequest | null>>(`${this.apiUrl}/user/${userId}/current`)
      .pipe(
        map(response => response.data || null),
        catchError(error => {
          console.error(`Error fetching current prayer request for user ${userId}:`, error);
          throw error;
        })
      );
  }
}
