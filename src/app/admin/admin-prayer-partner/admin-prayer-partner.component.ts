import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerRequestFormComponent } from '../../prayer-request/prayer-request-form.component';
import { PrayerPartnerService, CurrentPartnerResponse } from '../../services/prayer-partner.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-prayer-partner',
  standalone: true,
  imports: [CommonModule, PrayerRequestFormComponent],
  templateUrl: './admin-prayer-partner.component.html',
  styleUrl: './admin-prayer-partner.component.scss'
})
export class AdminPrayerPartnerComponent implements OnInit {
  currentPartners: CurrentPartnerResponse[] = [];
  loading = {
    partner: false
  };
  errorMessage = '';
  lastRefreshTime = new Date();

  constructor(
    private authService: AuthService,
    private prayerPartnerService: PrayerPartnerService
  ) {}

  ngOnInit(): void {
    this.loadCurrentPartner();
  }

  loadCurrentPartner(): void {
    this.loading.partner = true;
    this.errorMessage = '';
    
    this.prayerPartnerService.getCurrentPartner().pipe(
      finalize(() => this.loading.partner = false)
    ).subscribe({
      next: (response) => {
        this.currentPartners = response;
        this.lastRefreshTime = new Date();
      },
      error: (error) => {
        console.error('Error loading current partner:', error);
        this.errorMessage = 'Failed to load your prayer partners. Please try again.';
      }
    });
  }

  refreshPartners(): void {
    if (this.loading.partner) return;
    this.loadCurrentPartner();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
