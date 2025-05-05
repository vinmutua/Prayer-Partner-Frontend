import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth.service';
import { PrayerPartnerService, PrayerPairing, PrayerRequest, PrayerPartner } from '../services/prayer-partner.service';
import { ThemeService } from '../services/theme.service';
import { PrayerRequestService } from '../services/prayer-request.service';
import { UserService } from '../services/user.service';
import { PdfExportService } from '../services/pdf-export.service';
import { ToastService } from '../services/toast.service';
import { UserFormComponent } from './user-form/user-form.component';
import { ThemeFormComponent } from './theme-form/theme-form.component';
import { PairingFormComponent } from './pairing-form/pairing-form.component';
import { AdminPrayerPartnerComponent } from './admin-prayer-partner/admin-prayer-partner.component';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';
import { PrayerRequestModalComponent } from '../shared/components/prayer-request-modal/prayer-request-modal.component';
import { PrayerRequestEditModalComponent } from '../shared/components/prayer-request-edit-modal/prayer-request-edit-modal.component';
import { EmailModalComponent } from '../shared/components/email-modal/email-modal.component';
import { NoPrayerRequestModalComponent } from '../shared/components/no-prayer-request-modal/no-prayer-request-modal.component';
import { MobileSideMenuComponent } from './mobile-side-menu/mobile-side-menu.component';
import { PrayerTheme } from '../types/api.types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    FormsModule,
    UserFormComponent,
    ThemeFormComponent,
    PairingFormComponent,
    AdminPrayerPartnerComponent,
    ConfirmationModalComponent,
    PrayerRequestModalComponent,
    PrayerRequestEditModalComponent,
    EmailModalComponent,
    NoPrayerRequestModalComponent,
    MobileSideMenuComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  user: User | null = null;
  activeTab: 'users' | 'pairings' | 'themes' | 'requests' | 'my-partners' = 'users';
  isActionsDropdownOpen = false;
  isMobileSideMenuOpen = false;

  // User management
  users: User[] = [];
  showAddUserForm = false;
  selectedUser: User | null = null;

  // Pairing management
  currentPairings: PrayerPairing[] = [];
  filteredPairings: PrayerPairing[] = [];
  _pairingSearchTerm: string = '';
  // This is a getter/setter property defined in ngOnInit
  pairingSearchTerm: string = '';
  showGeneratePairingsForm = false;

  // Theme management
  themes: PrayerTheme[] = [];
  showAddThemeForm = false;
  selectedTheme: PrayerTheme | null = null;

  // Prayer request management
  prayerRequests: PrayerRequest[] = [];
  selectedPrayerRequest: PrayerRequest | null = null;

  // Modal states
  showDeleteConfirmModal = false;
  deleteConfirmMessage = '';
  deleteItemId: number | null = null;
  deleteItemType: 'user' | 'theme' | 'request' | 'pairing' | null = null;
  deleteAction: string | null = null;

  // Modals
  showPrayerRequestModal = false;
  showPrayerRequestEditModal = false;
  showEmailModal = false;
  showNoPrayerRequestModal = false;
  selectedPrayerPartnerName = '';
  selectedPrayerPartnerForNoRequest: PrayerPartner | null = null;
  selectedPairing: PrayerPairing | null = null;
  isAllPairingsEmail = false;
  isReminderEmail = false;

  // Loading and error states
  loading = {
    users: false,
    pairings: false,
    themes: false,
    requests: false
  };
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private prayerPartnerService: PrayerPartnerService,
    private themeService: ThemeService,
    private prayerRequestService: PrayerRequestService,
    private pdfExportService: PdfExportService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();

    if (!this.user || this.user.role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }

    // Initialize filtered pairings
    this.filteredPairings = [];

    // Initialize search term
    this._pairingSearchTerm = '';

    // Set up search term property with getter/setter
    Object.defineProperty(this, 'pairingSearchTerm', {
      get: function() { return this._pairingSearchTerm; },
      set: function(value) {
        this._pairingSearchTerm = value;
        this.filterPairings();
      }
    });

    // Listen for admin actions from mobile menu
    window.addEventListener('admin-action', ((event: CustomEvent) => {
      const { section, action } = event.detail;

      if (section === 'pairings') {
        switch (action) {
          case 'generate':
            this.openGeneratePairingsForm();
            break;
          case 'clear':
            this.clearAllPairings();
            break;
          case 'export-csv':
            this.exportPairingsCSV();
            break;
          case 'export-pdf':
            this.exportPairingsToPdf();
            break;
          case 'send-emails':
            this.sendPartnerEmails();
            break;
          case 'send-reminders':
            this.sendReminderEmails();
            break;
        }
      } else if (section === 'themes') {
        switch (action) {
          case 'add-theme':
            this.openAddThemeForm();
            break;
          case 'export-themes':
            this.exportThemesToPdf();
            break;
        }
      }
    }) as EventListener);

    this.loadUsers();
    this.loadCurrentPairings();
    this.loadThemes();
    this.loadPrayerRequests();
  }

  // User management methods
  loadUsers(): void {
    this.loading.users = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading.users = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.showError('Failed to load users. Please try again.');
        this.loading.users = false;
      }
    });
  }

  openAddUserForm(): void {
    this.selectedUser = null;
    this.showAddUserForm = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.showAddUserForm = true;
  }

  saveUser(userData: any): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (userData.id) {
      // Update existing user
      this.userService.updateUser(userData.id, userData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('User updated successfully');
          this.showAddUserForm = false;
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.showError(error.message || 'Failed to update user. Please try again.');
        }
      });
    } else {
      // Create new user
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.toastService.showSuccess('User created successfully');
          this.showAddUserForm = false;
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.toastService.showError(error.message || 'Failed to create user. Please try again.');
        }
      });
    }
  }

  deleteUser(userId: number): void {
    this.deleteItemType = 'user';
    this.deleteItemId = userId;
    this.deleteConfirmMessage = 'Are you sure you want to delete this user? This action cannot be undone.';
    this.showDeleteConfirmModal = true;
  }

  confirmDeleteUser(): void {
    if (!this.deleteItemId) return;

    const userId = this.deleteItemId;
    this.loading.users = true;
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastService.showSuccess('User deleted successfully');
        this.users = this.users.filter(user => user.id !== userId);
        this.loading.users = false;
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        this.toastService.showError('Failed to delete user. Please try again.');
        this.loading.users = false;
      }
    });

    this.closeDeleteConfirmModal();
  }

  // Pairing management methods
  loadCurrentPairings(): void {
    this.loading.pairings = true;
    this.errorMessage = '';
    console.log('Attempting to load current pairings...');

    this.prayerPartnerService.getCurrentPairings().subscribe({
      next: (pairings) => {
        console.log('Pairings loaded successfully:', pairings);
        this.currentPairings = pairings;
        this.filterPairings();
        this.loading.pairings = false;
      },
      error: (error) => {
        console.error('Error loading current pairings:', error);
        this.errorMessage = 'Failed to load pairings. Please try again.';
        this.loading.pairings = false;
      }
    });
  }

  filterPairings(): void {
    if (!this.pairingSearchTerm) {
      this.filteredPairings = [...this.currentPairings];
      return;
    }

    const searchTerm = this.pairingSearchTerm.toLowerCase();
    this.filteredPairings = this.currentPairings.filter(pairing =>
      pairing.partner1.firstName.toLowerCase().includes(searchTerm) ||
      pairing.partner1.lastName.toLowerCase().includes(searchTerm) ||
      pairing.partner1.email.toLowerCase().includes(searchTerm) ||
      pairing.partner2.firstName.toLowerCase().includes(searchTerm) ||
      pairing.partner2.lastName.toLowerCase().includes(searchTerm) ||
      pairing.partner2.email.toLowerCase().includes(searchTerm) ||
      pairing.theme.title.toLowerCase().includes(searchTerm)
    );
  }

  clearAllPairings(): void {
    this.deleteConfirmMessage = 'Are you sure you want to clear all current pairings? This action cannot be undone.';
    this.deleteAction = 'clear-all-pairings';
    this.showDeleteConfirmModal = true;
  }

  // Execute clear all pairings after confirmation
  executeClearAllPairings(): void {
    this.loading.pairings = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.prayerPartnerService.clearAllPairings().subscribe({
      next: (response) => {
        console.log('Clear pairings response:', response);
        if (response.data && response.data.count !== undefined) {
          this.successMessage = `Successfully cleared ${response.data.count} prayer pairings`;
        } else {
          this.successMessage = response.message || 'Successfully cleared prayer pairings';
        }
        this.loadCurrentPairings();
        // Make sure loading state is reset even if loadCurrentPairings fails
        setTimeout(() => {
          this.loading.pairings = false;
        }, 500);
      },
        error: (error) => {
          console.error('Error clearing pairings:', error);
          if (error.status === 404) {
            this.successMessage = 'No current pairings found to clear';
          } else {
            this.errorMessage = error.message || 'Failed to clear pairings. Please try again.';
          }
          this.loading.pairings = false;
        }
      });
    }


  sendPartnerEmails(): void {
    this.selectedPairing = null;
    this.isAllPairingsEmail = true;
    this.isReminderEmail = false;
    this.showEmailModal = true;
  }

  sendReminderEmails(): void {
    this.selectedPairing = null;
    this.isAllPairingsEmail = false;
    this.isReminderEmail = true;
    this.showEmailModal = true;
  }

  closeEmailModal(): void {
    this.showEmailModal = false;
    this.selectedPairing = null;
    this.isAllPairingsEmail = false;
    this.isReminderEmail = false;
  }

  sendEmail(emailData: {pairingId?: number; customMessage?: string; isAllPairings: boolean; isReminder: boolean}): void {
    this.loading.pairings = true;

    if (emailData.isReminder) {
      // Send reminder emails
      this.prayerPartnerService.sendReminderEmails().subscribe({
        next: (response) => {
          console.log('Send reminder emails response:', response);
          this.toastService.showSuccess(response.message || 'Successfully sent reminder emails to users');
          this.loading.pairings = false;
          this.closeEmailModal();
        },
        error: (error) => {
          console.error('Error sending reminder emails:', error);
          if (error.status === 404) {
            this.toastService.showError('No active users or current pairings found to send reminders');
          } else {
            this.toastService.showError(error.message || 'Failed to send reminder emails. Please try again.');
          }
          this.loading.pairings = false;
        }
      });
    } else if (emailData.isAllPairings) {
      // Send emails to all pairings
      this.prayerPartnerService.sendPartnerEmails().subscribe({
        next: (response) => {
          console.log('Send partner emails response:', response);
          this.toastService.showSuccess(response.message || 'Successfully sent emails to prayer partners');
          this.loadCurrentPairings();
          // Make sure loading state is reset even if loadCurrentPairings fails
          setTimeout(() => {
            this.loading.pairings = false;
          }, 500);
          this.closeEmailModal();
        },
        error: (error) => {
          console.error('Error sending partner emails:', error);
          if (error.status === 404) {
            this.toastService.showError('No current pairings found to send emails');
          } else {
            this.toastService.showError(error.message || 'Failed to send partner emails. Please try again.');
          }
          this.loading.pairings = false;
        }
      });
    } else if (emailData.pairingId) {
      // Send email to specific pairing
      this.prayerPartnerService.sendEmailToPairing(emailData.pairingId, emailData.customMessage).subscribe({
        next: (response) => {
          const pairing = this.currentPairings.find(p => p.id === emailData.pairingId);
          if (pairing) {
            pairing.emailSent = true;
            pairing.emailSentAt = new Date().toISOString();
            this.toastService.showSuccess(`Email sent successfully to ${pairing.partner1.firstName} and ${pairing.partner2.firstName}`);
          } else {
            this.toastService.showSuccess('Email sent successfully');
          }
          this.loading.pairings = false;
          this.closeEmailModal();
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.toastService.showError('Failed to send email. Please try again.');
          this.loading.pairings = false;
        }
      });
    }
  }

  openGeneratePairingsForm(): void {
    if (this.themes.filter(theme => theme.active).length === 0) {
      this.errorMessage = 'Please create at least one active theme before generating pairings.';
      return;
    }
    this.showGeneratePairingsForm = true;
  }

  generatePairings(pairingData: any): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading.pairings = true;

    this.prayerPartnerService.generatePairings({
      startDate: pairingData.startDate,
      endDate: pairingData.endDate,
      themeId: pairingData.themeId
    }).subscribe({
      next: (response) => {
        // Display a more detailed success message if available
        if (response.data && response.data.clearedCount !== undefined) {
          this.successMessage = `Successfully cleared ${response.data.clearedCount} existing pairings and created ${response.data.createdCount} new prayer pairings`;
        } else {
          this.successMessage = response.message || 'Successfully created prayer pairings';
        }
        this.showGeneratePairingsForm = false;
        this.loadCurrentPairings();
        this.loading.pairings = false;
      },
      error: (error) => {
        console.error('Error generating pairings:', error);
        this.errorMessage = error.message || 'Failed to generate pairings. Please try again.';
        this.loading.pairings = false;
      }
    });
  }

  exportPairingsCSV(): void {
    this.loading.pairings = true;
    this.errorMessage = '';

    // Get the JWT token from auth service
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'Authentication required. Please log in again.';
      this.loading.pairings = false;
      return;
    }

    // Create a link to download the CSV with authentication
    const link = document.createElement('a');
    // Add the token as a query parameter
    link.href = `${this.prayerPartnerService.apiUrl}/export-csv?token=${token}`;
    link.download = 'prayer-pairings.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      this.loading.pairings = false;
    }, 1000);
  }

  exportPairingsToPdf(): void {
    if (this.currentPairings.length === 0) {
      alert('No pairings to export.');
      return;
    }

    try {
      console.log('Exporting pairings to PDF...');

      // Use the direct approach that works in the test
      this.pdfExportService.exportPairingsToPdf(
        this.currentPairings,
        'Current Prayer Pairings'
      );

      this.toastService.showSuccess('Prayer pairings exported to PDF successfully');
    } catch (error: any) {
      console.error('Error in exportPairingsToPdf:', error);
      alert(`Error exporting pairings: ${error.message || 'Unknown error'}`);
    }
  }

  // Theme management methods
  loadThemes(): void {
    this.loading.themes = true;
    this.themeService.getAllThemes().subscribe({
      next: (themes) => {
        this.themes = themes;
        this.loading.themes = false;
      },
      error: (error) => {
        console.error('Error loading themes:', error);
        this.errorMessage = 'Failed to load themes. Please try again.';
        this.loading.themes = false;
      }
    });
  }

  openAddThemeForm(): void {
    this.selectedTheme = null;
    this.showAddThemeForm = true;
  }

  editTheme(theme: PrayerTheme): void {
    this.selectedTheme = theme;
    this.showAddThemeForm = true;
  }

  saveTheme(themeData: any): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (themeData.id) {
      // Update existing theme
      this.themeService.updateTheme(themeData.id, themeData).subscribe({
        next: (response) => {
          this.successMessage = 'Theme updated successfully';
          this.showAddThemeForm = false;
          this.loadThemes();
        },
        error: (error) => {
          console.error('Error updating theme:', error);
          this.errorMessage = error.message || 'Failed to update theme. Please try again.';
        }
      });
    } else {
      // Create new theme
      this.themeService.createTheme(themeData).subscribe({
        next: (response) => {
          this.successMessage = 'Theme created successfully';
          this.showAddThemeForm = false;
          this.loadThemes();
        },
        error: (error) => {
          console.error('Error creating theme:', error);
          this.errorMessage = error.message || 'Failed to create theme. Please try again.';
        }
      });
    }
  }

  deleteTheme(themeId: number): void {
    this.deleteItemType = 'theme';
    this.deleteItemId = themeId;
    this.deleteConfirmMessage = 'Are you sure you want to delete this theme? This action cannot be undone.';
    this.showDeleteConfirmModal = true;
  }

  confirmDeleteTheme(): void {
    if (!this.deleteItemId) return;

    const themeId = this.deleteItemId;
    this.loading.themes = true;
    this.themeService.deleteTheme(themeId).subscribe({
      next: () => {
        this.toastService.showSuccess('Theme deleted successfully');
        this.themes = this.themes.filter(theme => theme.id !== themeId);
        this.loading.themes = false;
      },
      error: (error) => {
        console.error('Error deleting theme:', error);
        this.toastService.showError('Failed to delete theme. It may be in use by existing pairings.');
        this.loading.themes = false;
      }
    });

    this.closeDeleteConfirmModal();
  }

  exportThemesToPdf(): void {
    if (this.themes.length === 0) {
      alert('No themes to export.');
      return;
    }

    try {
      console.log('Exporting themes to PDF...');

      // Use the direct approach that works in the test
      this.pdfExportService.exportThemesToPdf(
        this.themes,
        'Prayer Themes'
      );

      this.toastService.showSuccess('Prayer themes exported to PDF successfully');
    } catch (error: any) {
      console.error('Error in exportThemesToPdf:', error);
      alert(`Error exporting themes: ${error.message || 'Unknown error'}`);
    }
  }

  // Toggle actions dropdown
  toggleActionsDropdown(): void {
    this.isActionsDropdownOpen = !this.isActionsDropdownOpen;
  }

  // Toggle mobile side menu
  toggleMobileSideMenu(): void {
    this.isMobileSideMenuOpen = !this.isMobileSideMenuOpen;
  }

  // Close mobile side menu
  closeMobileSideMenu(): void {
    this.isMobileSideMenuOpen = false;
  }

  // Handle tab change from mobile menu
  onMobileTabChange(tabId: string): void {
    this.activeTab = tabId as any;
  }

  // Close actions dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdownButton = document.querySelector('.actions-dropdown-button');
    const dropdownMenu = document.querySelector('.actions-dropdown-menu');

    if (dropdownButton && dropdownMenu) {
      if (!dropdownButton.contains(event.target as Node) &&
          !dropdownMenu.contains(event.target as Node)) {
        this.isActionsDropdownOpen = false;
      }
    }
  }

  // Helper methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Prayer request management methods
  loadPrayerRequests(): void {
    this.loading.requests = true;
    this.prayerRequestService.getAllPrayerRequests().subscribe({
      next: (requests) => {
        this.prayerRequests = requests;
        this.loading.requests = false;
      },
      error: (error) => {
        console.error('Error loading prayer requests:', error);
        this.toastService.showError('Failed to load prayer requests. Please try again.');
        this.loading.requests = false;
      }
    });
  }

  editPrayerRequest(request: PrayerRequest): void {
    this.selectedPrayerRequest = request;
    this.selectedPrayerPartnerName = request.user ? `${request.user.firstName} ${request.user.lastName}` : 'User';
    this.showPrayerRequestEditModal = true;
  }

  closePrayerRequestEditModal(): void {
    this.showPrayerRequestEditModal = false;
  }

  savePrayerRequest(updatedRequest: {id: number, content: string, isActive: boolean}): void {
    this.updatePrayerRequest(updatedRequest.id, {
      content: updatedRequest.content,
      isActive: updatedRequest.isActive
    });
    this.closePrayerRequestEditModal();
  }

  updatePrayerRequest(id: number, data: { content?: string; isActive?: boolean }): void {
    this.loading.requests = true;

    this.prayerRequestService.updatePrayerRequest(id, data).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Prayer request updated successfully');
        this.loadPrayerRequests();
      },
      error: (error) => {
        console.error('Error updating prayer request:', error);
        this.toastService.showError('Failed to update prayer request. Please try again.');
        this.loading.requests = false;
      }
    });
  }

  togglePrayerRequestStatus(request: PrayerRequest): void {
    this.updatePrayerRequest(request.id, { isActive: !request.isActive });
  }

  deletePrayerRequest(id: number): void {
    this.deleteItemType = 'request';
    this.deleteItemId = id;
    this.deleteConfirmMessage = 'Are you sure you want to delete this prayer request? This action cannot be undone.';
    this.showDeleteConfirmModal = true;
  }

  confirmDeletePrayerRequest(): void {
    if (!this.deleteItemId) return;

    const requestId = this.deleteItemId;
    this.loading.requests = true;
    this.prayerRequestService.deletePrayerRequest(requestId).subscribe({
      next: () => {
        this.toastService.showSuccess('Prayer request deleted successfully');
        this.prayerRequests = this.prayerRequests.filter(req => req.id !== requestId);
        this.loading.requests = false;
      },
      error: (error) => {
        console.error('Error deleting prayer request:', error);
        this.toastService.showError('Failed to delete prayer request. It may be in use by existing pairings.');
        this.loading.requests = false;
      }
    });

    this.closeDeleteConfirmModal();
  }

  // View and email methods for pairings
  viewPrayerRequest(pairing: PrayerPairing): void {
    if (!pairing.request) {
      // Show the no prayer request modal instead
      this.selectedPrayerPartnerName = `${pairing.partner2.firstName} ${pairing.partner2.lastName}`;
      this.selectedPrayerPartnerForNoRequest = pairing.partner2;
      this.showNoPrayerRequestModal = true;
      return;
    }

    this.selectedPrayerRequest = pairing.request;
    this.selectedPrayerPartnerName = `${pairing.partner2.firstName} ${pairing.partner2.lastName}`;
    this.showPrayerRequestModal = true;
  }

  closePrayerRequestModal(): void {
    this.showPrayerRequestModal = false;
    this.selectedPrayerRequest = null;
  }

  closeNoPrayerRequestModal(): void {
    this.showNoPrayerRequestModal = false;
    this.selectedPrayerPartnerForNoRequest = null;
  }

  sendEmailToPartnerWithNoRequest(partner: PrayerPartner): void {
    // Create a temporary pairing object with the partner as partner2
    const tempPairing: PrayerPairing = {
      id: 0, // Temporary ID
      partner1: this.user as PrayerPartner,
      partner2: partner,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      theme: { id: 0, title: 'Prayer Request Reminder', description: '', active: true }
    };

    this.selectedPairing = tempPairing;
    this.isAllPairingsEmail = false;
    this.isReminderEmail = false;
    this.showEmailModal = true;
    this.closeNoPrayerRequestModal();
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.deleteItemId = null;
    this.deleteItemType = null;
    this.deleteAction = null;
  }

  confirmDelete(): void {
    // Check if this is a special action like clearing all pairings
    if (this.deleteAction === 'clear-all-pairings') {
      this.executeClearAllPairings();
      this.closeDeleteConfirmModal();
      return;
    }

    // Handle regular delete operations by item type
    switch (this.deleteItemType) {
      case 'user':
        this.confirmDeleteUser();
        break;
      case 'theme':
        this.confirmDeleteTheme();
        break;
      case 'request':
        this.confirmDeletePrayerRequest();
        break;
      default:
        this.closeDeleteConfirmModal();
    }
  }

  sendEmailToPairing(pairing: PrayerPairing): void {
    this.selectedPairing = pairing;
    this.isAllPairingsEmail = false;
    this.isReminderEmail = false;
    this.showEmailModal = true;
  }

  // Logout is now handled by the header component
}
