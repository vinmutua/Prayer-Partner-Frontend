// This file contains all the missing methods that need to be added to the AdminComponent class

// Add these methods to the AdminComponent class to fix the TypeScript errors

/**
 * This method is already implemented in the component
 */
// closeMobileSideMenu(): void {
//   this.isMobileSideMenuOpen = false;
// }

/**
 * This method is already implemented in the component
 */
// onMobileTabChange(tabId: string): void {
//   this.activeTab = tabId as any;
// }

/**
 * This method is already implemented in the component
 */
// toggleMobileSideMenu(): void {
//   this.isMobileSideMenuOpen = !this.isMobileSideMenuOpen;
// }

/**
 * This method is already implemented in the component
 */
// openGeneratePairingsForm(): void {
//   if (this.themes.filter(theme => theme.active).length === 0) {
//     this.errorMessage = 'Please create at least one active theme before generating pairings.';
//     return;
//   }
//   this.showGeneratePairingsForm = true;
// }

/**
 * This method is already implemented in the component
 */
// toggleActionsDropdown(): void {
//   this.isActionsDropdownOpen = !this.isActionsDropdownOpen;
// }

/**
 * This method is already implemented in the component
 */
// exportPairingsCSV(): void {
//   this.loading.pairings = true;
//   this.errorMessage = '';

//   // Get the JWT token from auth service
//   const token = this.authService.getToken();

//   if (!token) {
//     this.errorMessage = 'Authentication required. Please log in again.';
//     this.loading.pairings = false;
//     return;
//   }

//   // Create a link to download the CSV with authentication
//   const link = document.createElement('a');
//   // Add the token as a query parameter
//   link.href = `${this.prayerPartnerService.apiUrl}/export-csv?token=${token}`;
//   link.download = 'prayer-pairings.csv';
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   setTimeout(() => {
//     this.loading.pairings = false;
//   }, 1000);
// }

/**
 * This method is already implemented in the component
 */
// exportPairingsToPdf(): void {
//   if (this.currentPairings.length === 0) {
//     alert('No pairings to export.');
//     return;
//   }

//   try {
//     console.log('Exporting pairings to PDF...');

//     // Use the direct approach that works in the test
//     this.pdfExportService.exportPairingsToPdf(
//       this.currentPairings,
//       'Current Prayer Pairings'
//     );

//     this.toastService.showSuccess('Prayer pairings exported to PDF successfully');
//   } catch (error: any) {
//     console.error('Error in exportPairingsToPdf:', error);
//     alert(`Error exporting pairings: ${error.message || 'Unknown error'}`);
//   }
// }

/**
 * This method is already implemented in the component
 */
// sendPartnerEmails(): void {
//   this.selectedPairing = null;
//   this.isAllPairingsEmail = true;
//   this.isReminderEmail = false;
//   this.showEmailModal = true;
// }

/**
 * This method is already implemented in the component
 */
// sendReminderEmails(): void {
//   this.selectedPairing = null;
//   this.isAllPairingsEmail = false;
//   this.isReminderEmail = true;
//   this.showEmailModal = true;
// }

/**
 * This method is already implemented in the component
 */
// formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// }

/**
 * This method is already implemented in the component
 */
// viewPrayerRequest(pairing: PrayerPairing): void {
//   if (!pairing.request) {
//     // Show the no prayer request modal instead
//     this.selectedPrayerPartnerName = `${pairing.partner2.firstName} ${pairing.partner2.lastName}`;
//     this.selectedPrayerPartnerForNoRequest = pairing.partner2;
//     this.showNoPrayerRequestModal = true;
//     return;
//   }

//   this.selectedPrayerRequest = pairing.request;
//   this.selectedPrayerPartnerName = `${pairing.partner2.firstName} ${pairing.partner2.lastName}`;
//   this.showPrayerRequestModal = true;
// }

/**
 * This method is already implemented in the component
 */
// sendEmailToPairing(pairing: PrayerPairing): void {
//   this.selectedPairing = pairing;
//   this.isAllPairingsEmail = false;
//   this.isReminderEmail = false;
//   this.showEmailModal = true;
// }

/**
 * This method is already implemented in the component
 */
// exportThemesToPdf(): void {
//   if (this.themes.length === 0) {
//     alert('No themes to export.');
//     return;
//   }

//   try {
//     console.log('Exporting themes to PDF...');

//     // Use the direct approach that works in the test
//     this.pdfExportService.exportThemesToPdf(
//       this.themes,
//       'Prayer Themes'
//     );

//     this.toastService.showSuccess('Prayer themes exported to PDF successfully');
//   } catch (error: any) {
//     console.error('Error in exportThemesToPdf:', error);
//     alert(`Error exporting themes: ${error.message || 'Unknown error'}`);
//   }
// }

/**
 * This method is already implemented in the component
 */
// openAddThemeForm(): void {
//   this.selectedTheme = null;
//   this.showAddThemeForm = true;
// }

/**
 * This method is already implemented in the component
 */
// editTheme(theme: PrayerTheme): void {
//   this.selectedTheme = theme;
//   this.showAddThemeForm = true;
// }

/**
 * This method is already implemented in the component
 */
// deleteTheme(themeId: number): void {
//   this.deleteItemType = 'theme';
//   this.deleteItemId = themeId;
//   this.deleteConfirmMessage = 'Are you sure you want to delete this theme? This action cannot be undone.';
//   this.showDeleteConfirmModal = true;
// }

/**
 * This method is already implemented in the component
 */
// editPrayerRequest(request: PrayerRequest): void {
//   this.selectedPrayerRequest = request;
//   this.selectedPrayerPartnerName = request.user ? `${request.user.firstName} ${request.user.lastName}` : 'User';
//   this.showPrayerRequestEditModal = true;
// }

/**
 * This method is already implemented in the component
 */
// togglePrayerRequestStatus(request: PrayerRequest): void {
//   this.updatePrayerRequest(request.id, { isActive: !request.isActive });
// }

/**
 * This method is already implemented in the component
 */
// deletePrayerRequest(id: number): void {
//   this.deleteItemType = 'request';
//   this.deleteItemId = id;
//   this.deleteConfirmMessage = 'Are you sure you want to delete this prayer request? This action cannot be undone.';
//   this.showDeleteConfirmModal = true;
// }

/**
 * This method is already implemented in the component
 */
// saveTheme(themeData: any): void {
//   this.errorMessage = '';
//   this.successMessage = '';

//   if (themeData.id) {
//     // Update existing theme
//     this.themeService.updateTheme(themeData.id, themeData).subscribe({
//       next: (response) => {
//         this.successMessage = 'Theme updated successfully';
//         this.showAddThemeForm = false;
//         this.loadThemes();
//       },
//       error: (error) => {
//         console.error('Error updating theme:', error);
//         this.errorMessage = error.message || 'Failed to update theme. Please try again.';
//       }
//     });
//   } else {
//     // Create new theme
//     this.themeService.createTheme(themeData).subscribe({
//       next: (response) => {
//         this.successMessage = 'Theme created successfully';
//         this.showAddThemeForm = false;
//         this.loadThemes();
//       },
//       error: (error) => {
//         console.error('Error creating theme:', error);
//         this.errorMessage = error.message || 'Failed to create theme. Please try again.';
//       }
//     });
//   }
// }

/**
 * This method is already implemented in the component
 */
// generatePairings(pairingData: any): void {
//   this.errorMessage = '';
//   this.successMessage = '';
//   this.loading.pairings = true;

//   this.prayerPartnerService.generatePairings({
//     startDate: pairingData.startDate,
//     endDate: pairingData.endDate,
//     themeId: pairingData.themeId
//   }).subscribe({
//     next: (response) => {
//       // Display a more detailed success message if available
//       if (response.data && response.data.clearedCount !== undefined) {
//         this.successMessage = `Successfully cleared ${response.data.clearedCount} existing pairings and created ${response.data.createdCount} new prayer pairings`;
//       } else {
//         this.successMessage = response.message || 'Successfully created prayer pairings';
//       }
//       this.showGeneratePairingsForm = false;
//       this.loadCurrentPairings();
//       this.loading.pairings = false;
//     },
//     error: (error) => {
//       console.error('Error generating pairings:', error);
//       this.errorMessage = error.message || 'Failed to generate pairings. Please try again.';
//       this.loading.pairings = false;
//     }
//   });
// }

/**
 * This method is already implemented in the component
 */
// confirmDelete(): void {
//   // Check if this is a special action like clearing all pairings
//   if (this.deleteAction === 'clear-all-pairings') {
//     this.executeClearAllPairings();
//     this.closeDeleteConfirmModal();
//     return;
//   }

//   // Handle regular delete operations by item type
//   switch (this.deleteItemType) {
//     case 'user':
//       this.confirmDeleteUser();
//       break;
//     case 'theme':
//       this.confirmDeleteTheme();
//       break;
//     case 'request':
//       this.confirmDeletePrayerRequest();
//       break;
//     default:
//       this.closeDeleteConfirmModal();
//   }
// }

/**
 * This method is already implemented in the component
 */
// closeDeleteConfirmModal(): void {
//   this.showDeleteConfirmModal = false;
//   this.deleteItemId = null;
//   this.deleteItemType = null;
//   this.deleteAction = null;
// }

/**
 * This method is already implemented in the component
 */
// closePrayerRequestModal(): void {
//   this.showPrayerRequestModal = false;
//   this.selectedPrayerRequest = null;
// }

/**
 * This method is already implemented in the component
 */
// closePrayerRequestEditModal(): void {
//   this.showPrayerRequestEditModal = false;
// }

/**
 * This method is already implemented in the component
 */
// savePrayerRequest(updatedRequest: {id: number, content: string, isActive: boolean}): void {
//   this.updatePrayerRequest(updatedRequest.id, {
//     content: updatedRequest.content,
//     isActive: updatedRequest.isActive
//   });
//   this.closePrayerRequestEditModal();
// }

/**
 * This method is already implemented in the component
 */
// closeEmailModal(): void {
//   this.showEmailModal = false;
//   this.selectedPairing = null;
//   this.isAllPairingsEmail = false;
//   this.isReminderEmail = false;
// }

/**
 * This method is already implemented in the component
 */
// sendEmail(emailData: {pairingId?: number; customMessage?: string; isAllPairings: boolean; isReminder: boolean}): void {
//   this.loading.pairings = true;

//   if (emailData.isReminder) {
//     // Send reminder emails
//     this.prayerPartnerService.sendReminderEmails().subscribe({
//       next: (response) => {
//         console.log('Send reminder emails response:', response);
//         this.toastService.showSuccess(response.message || 'Successfully sent reminder emails to users');
//         this.loading.pairings = false;
//         this.closeEmailModal();
//       },
//       error: (error) => {
//         console.error('Error sending reminder emails:', error);
//         if (error.status === 404) {
//           this.toastService.showError('No active users or current pairings found to send reminders');
//         } else {
//           this.toastService.showError(error.message || 'Failed to send reminder emails. Please try again.');
//         }
//         this.loading.pairings = false;
//       }
//     });
//   } else if (emailData.isAllPairings) {
//     // Send emails to all pairings
//     this.prayerPartnerService.sendPartnerEmails().subscribe({
//       next: (response) => {
//         console.log('Send partner emails response:', response);
//         this.toastService.showSuccess(response.message || 'Successfully sent emails to prayer partners');
//         this.loadCurrentPairings();
//         // Make sure loading state is reset even if loadCurrentPairings fails
//         setTimeout(() => {
//           this.loading.pairings = false;
//         }, 500);
//         this.closeEmailModal();
//       },
//       error: (error) => {
//         console.error('Error sending partner emails:', error);
//         if (error.status === 404) {
//           this.toastService.showError('No current pairings found to send emails');
//         } else {
//           this.toastService.showError(error.message || 'Failed to send partner emails. Please try again.');
//         }
//         this.loading.pairings = false;
//       }
//     });
//   } else if (emailData.pairingId) {
//     // Send email to specific pairing
//     this.prayerPartnerService.sendEmailToPairing(emailData.pairingId, emailData.customMessage).subscribe({
//       next: (response) => {
//         const pairing = this.currentPairings.find(p => p.id === emailData.pairingId);
//         if (pairing) {
//           pairing.emailSent = true;
//           pairing.emailSentAt = new Date().toISOString();
//           this.toastService.showSuccess(`Email sent successfully to ${pairing.partner1.firstName} and ${pairing.partner2.firstName}`);
//         } else {
//           this.toastService.showSuccess('Email sent successfully');
//         }
//         this.loading.pairings = false;
//         this.closeEmailModal();
//       },
//       error: (error) => {
//         console.error('Error sending email:', error);
//         this.toastService.showError('Failed to send email. Please try again.');
//         this.loading.pairings = false;
//       }
//     });
//   }
// }

/**
 * This method is already implemented in the component
 */
// closeNoPrayerRequestModal(): void {
//   this.showNoPrayerRequestModal = false;
//   this.selectedPrayerPartnerForNoRequest = null;
// }

/**
 * This method is already implemented in the component
 */
// sendEmailToPartnerWithNoRequest(partner: PrayerPartner): void {
//   // Create a temporary pairing object with the partner as partner2
//   const tempPairing: PrayerPairing = {
//     id: 0, // Temporary ID
//     partner1: this.user as PrayerPartner,
//     partner2: partner,
//     startDate: new Date().toISOString(),
//     endDate: new Date().toISOString(),
//     theme: { id: 0, title: 'Prayer Request Reminder', description: '', active: true }
//   };

//   this.selectedPairing = tempPairing;
//   this.isAllPairingsEmail = false;
//   this.isReminderEmail = false;
//   this.showEmailModal = true;
//   this.closeNoPrayerRequestModal();
// }
