import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  PrayerPartner,
  PrayerRequest,
  CurrentPartnerResponse,
  PrayerPairing,
  ApiResponse,
  formatDateForApi
} from '../types/api.types';

// Re-export the types for convenience
export type { PrayerPartner, PrayerRequest, CurrentPartnerResponse, PrayerPairing };

@Injectable({
  providedIn: 'root'
})
export class PrayerPartnerService {
  // Make apiUrl public for admin component to use
  public apiUrl = `${environment.apiUrl}/pairings`;

  constructor(private http: HttpClient) {}

  // Get current prayer partner for logged in user
  getCurrentPartner(): Observable<CurrentPartnerResponse[]> {
    return this.http.get<ApiResponse<CurrentPartnerResponse[]>>(`${this.apiUrl}/current-partner`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching current partner:', error);
          throw error;
        })
      );
  }

  // Get prayer partner history for logged in user
  getPairingHistory(): Observable<PrayerPairing[]> {
    return this.http.get<ApiResponse<PrayerPairing[]>>(`${this.apiUrl}/history`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching pairing history:', error);
          throw error;
        })
      );
  }

  // Admin: Get all current pairings (active based on date)
  getCurrentPairings(): Observable<PrayerPairing[]> {
    // The backend route '/' returns all current pairings (filtered by date)
    return this.http.get<ApiResponse<PrayerPairing[]>>(`${this.apiUrl}`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.error('Error fetching current pairings:', error);
          throw error;
        })
      );
  }

  // Admin: Generate one-way circular pairings for all active users
  generatePairings(data: {
    startDate: Date | string;
    endDate: Date | string;
    themeId: number;
  }): Observable<ApiResponse<any>> {
    // The new one-way system doesn't need these parameters as it:
    // 1. Automatically calculates dates (today + 30 days)
    // 2. Randomly selects an active theme
    // 3. Uses cryptographically secure shuffling
    
    // Call the new one-way circular pairing endpoint
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/generate-monthly`, {});
  }



  // Admin: Clear all current pairings
  clearAllPairings(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/clear-all`);
  }

  // Admin: Send emails to paired partners
  sendPartnerEmails(pairingIds?: number[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/send-partner-emails`, { pairingIds });
  }

  // Admin: Send reminder emails to all users
  sendReminderEmails(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/send-reminder-emails`, {});
  }

  // Admin: Delete a specific pairing
  deletePairing(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Admin: Export pairings to CSV
  exportPairingsToCSV(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-csv`, {
      responseType: 'blob'
    });
  }

  // Admin: Send email to a specific pairing
  sendEmailToPairing(pairingId: number, customMessage?: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${pairingId}/send-email`, { customMessage });
  }
}
