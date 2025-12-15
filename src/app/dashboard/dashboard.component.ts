import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PrayerPartnerService } from '../services/prayer-partner.service';
import { PdfExportService } from '../services/pdf-export.service';
import { User, CurrentPartnerResponse, PrayerPairing, PrayerRequest } from '../types/api.types';
import { PrayerRequestFormComponent } from '../prayer-request/prayer-request-form.component';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { finalize } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PrayerRequestFormComponent, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  currentPartners: CurrentPartnerResponse[] = [];
  pairingHistory: PrayerPairing[] = [];
  loading = {
    partner: false,
    history: false
  };

  // For notifications and refresh tracking
  hasNewPrayerRequest = false;
  lastRefreshTime = new Date();
  lastHistoryRefreshTime = new Date();

  // Modal properties
  isModalOpen = false;
  modalTitle = '';
  selectedPrayerRequest: PrayerRequest | null = null;
  selectedPartner: string = '';

  // Auto-refresh settings
  private autoRefreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  private refreshSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private prayerPartnerService: PrayerPartnerService,
    private pdfExportService: PdfExportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUserValue();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCurrentPartner();
    this.loadPairingHistory();

    // Set up auto-refresh
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Set up auto-refresh to check for new prayer requests periodically
  private setupAutoRefresh(): void {
    this.refreshSubscription = interval(this.autoRefreshInterval).subscribe(() => {
      // Only auto-refresh if the user is not actively loading data
      if (!this.loading.partner) {
        console.log('Auto-refreshing prayer partner information...');
        this.loadCurrentPartner();
      }
    });
  }

  loadCurrentPartner(): void {
    this.loading.partner = true;
    this.prayerPartnerService.getCurrentPartner().pipe(
      finalize(() => this.loading.partner = false)
    ).subscribe({
      next: (response) => {
        // Check for new prayer requests
        if (this.currentPartners.length > 0) {
          this.checkForNewPrayerRequests(this.currentPartners, response);
        }

        this.currentPartners = response;
        this.lastRefreshTime = new Date();
        this.loading.partner = false;
      },
      error: (error) => {
        console.error('Error loading current partner:', error);
        this.loading.partner = false;
      }
    });
  }

  // Method to refresh partner information
  refreshPartnerInfo(): void {
    if (this.loading.partner) return;

    // Show notification if there's a new prayer request
    this.hasNewPrayerRequest = false;

    // Reload partner information
    this.loadCurrentPartner();
  }

  // Check for new prayer requests
  private checkForNewPrayerRequests(oldPartners: CurrentPartnerResponse[], newPartners: CurrentPartnerResponse[]): void {
    // Create a map of old prayer requests by partner ID
    const oldRequestMap = new Map<number, string | undefined>();

    oldPartners.forEach(partner => {
      oldRequestMap.set(
        partner.partner.id,
        partner.prayerRequest?.content
      );
    });

    // Check if any partner has a new or updated prayer request
    newPartners.forEach(partner => {
      const partnerId = partner.partner.id;
      const oldContent = oldRequestMap.get(partnerId);
      const newContent = partner.prayerRequest?.content;

      // If there's a new prayer request or the content has changed
      if (
        (newContent && !oldContent) ||
        (newContent && oldContent && newContent !== oldContent)
      ) {
        this.hasNewPrayerRequest = true;

        // Show notification
        this.showNotification(
          `New prayer request from ${partner.partner.firstName}`,
          newContent || ''
        );
      }
    });
  }

  // Show notification
  private showNotification(title: string, message: string): void {
    // Check if browser notifications are supported
    if ('Notification' in window) {
      // Check if permission is already granted
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      }
      // Otherwise, request permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body: message });
          }
        });
      }
    }

    // Also show an in-app notification
    // This could be enhanced with a proper notification service
    const notificationElement = document.createElement('div');
    notificationElement.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
    notificationElement.innerHTML = `
      <div class="flex">
        <div class="py-1"><svg class="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p class="font-bold">${title}</p>
          <p class="text-sm">${message.length > 100 ? message.substring(0, 100) + '...' : message}</p>
        </div>
        <button class="ml-4" onclick="this.parentNode.parentNode.remove()">×</button>
      </div>
    `;

    document.body.appendChild(notificationElement);

    // Remove notification after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notificationElement)) {
        document.body.removeChild(notificationElement);
      }
    }, 5000);
  }

  loadPairingHistory(): void {
    this.loading.history = true;
    this.prayerPartnerService.getPairingHistory().pipe(
      finalize(() => this.loading.history = false)
    ).subscribe({
      next: (response) => {
        this.pairingHistory = response;
        this.lastHistoryRefreshTime = new Date();
        this.loading.history = false;
      },
      error: (error) => {
        console.error('Error loading pairing history:', error);
        this.loading.history = false;
      }
    });
  }

  // Method to refresh pairing history
  refreshPairingHistory(): void {
    if (this.loading.history) return;
    this.loadPairingHistory();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getPartnerName(pairing: PrayerPairing): string {
    const userId = this.user?.id;
    if (pairing.partner1.id === userId) {
      return `${pairing.partner2.firstName} ${pairing.partner2.lastName}`;
    } else {
      return `${pairing.partner1.firstName} ${pairing.partner1.lastName}`;
    }
  }

  getPartnerEmail(pairing: PrayerPairing): string {
    const userId = this.user?.id;
    if (pairing.partner1.id === userId) {
      return pairing.partner2.email;
    } else {
      return pairing.partner1.email;
    }
  }

  getPartnerRole(pairing: PrayerPairing): string {
    const userId = this.user?.id;
    if (pairing.partner1.id === userId) {
      return 'Prayed for';
    } else {
      return 'Prayed by';
    }
  }

  isPrayingFor(pairing: PrayerPairing): boolean {
    return pairing.partner1.id === this.user?.id;
  }

  // Export pairing history to PDF
  exportPairingHistoryToPdf(): void {
    if (this.pairingHistory.length === 0) {
      alert('No pairing history to export.');
      return;
    }

    this.pdfExportService.exportPairingsToPdf(
      this.pairingHistory,
      `${this.user?.firstName}'s Prayer Partner History`
    );
  }

  // Open modal to view prayer request
  openPrayerRequestModal(prayerRequest: PrayerRequest | undefined, partnerName: string): void {
    if (!prayerRequest) {
      return;
    }

    this.selectedPrayerRequest = prayerRequest;
    this.selectedPartner = partnerName;
    this.modalTitle = `${partnerName}'s Prayer Request`;
    this.isModalOpen = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedPrayerRequest = null;
  }

  // Logout is now handled by the header component
}
