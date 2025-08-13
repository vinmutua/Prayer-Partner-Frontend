import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrayerRequestService } from '../services/prayer-request.service';
import { ConfirmationModalComponent } from '../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-prayer-request-form',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, ConfirmationModalComponent],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Submit Your Prayer Request</h2>

      <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>

      <form [formGroup]="requestForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label for="content" class="block text-gray-700 text-sm font-bold mb-2">
            Your Prayer Request:
          </label>
          <textarea
            id="content"
            formControlName="content"
            rows="4"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Share what you'd like others to pray for..."
          ></textarea>
          <div *ngIf="requestForm.get('content')?.invalid && requestForm.get('content')?.touched" class="text-red-500 text-xs mt-1">
            Prayer request is required.
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            [disabled]="requestForm.invalid || isSubmitting"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {{ currentRequest ? 'Update Request' : 'Submit Request' }}
          </button>

          <button
            *ngIf="currentRequest"
            type="button"
            (click)="onDelete()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete Request
          </button>
        </div>
      </form>
    </div>

    <!-- Delete Confirmation Modal -->
    <app-confirmation-modal
      [isOpen]="showDeleteConfirmModal"
      [message]="'Are you sure you want to delete this prayer request? This action cannot be undone.'"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()">
    </app-confirmation-modal>
  `
})
export class PrayerRequestFormComponent implements OnInit {
  requestForm: FormGroup;
  currentRequest: any = null;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private prayerRequestService: PrayerRequestService
  ) {
    this.requestForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentRequest();
  }

  loadCurrentRequest(): void {
    this.prayerRequestService.getCurrentPrayerRequest().subscribe({
      next: (request) => {
        if (request) {
          this.currentRequest = request;
          this.requestForm.patchValue({
            content: request.content
          });
        }
        // If request is null, that's fine - no current request exists
      },
      error: (error) => {
        this.errorMessage = 'Error loading your current prayer request.';
        console.error('Error loading prayer request:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const requestData = {
      content: this.requestForm.value.content
    };

    if (this.currentRequest) {
      // Update existing request
      this.prayerRequestService.updatePrayerRequest(this.currentRequest.id, requestData).subscribe({
        next: (response) => {
          this.successMessage = 'Prayer request updated successfully!';
          this.isSubmitting = false;
          this.loadCurrentRequest();
        },
        error: (error) => {
          this.errorMessage = 'Error updating prayer request. Please try again.';
          console.error('Error updating prayer request:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new request
      this.prayerRequestService.createPrayerRequest(requestData).subscribe({
        next: (response) => {
          this.successMessage = 'Prayer request submitted successfully!';
          this.isSubmitting = false;
          this.loadCurrentRequest();
        },
        error: (error) => {
          this.errorMessage = 'Error submitting prayer request. Please try again.';
          console.error('Error submitting prayer request:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  showDeleteConfirmModal = false;

  onDelete(): void {
    if (!this.currentRequest) return;

    // Show confirmation modal instead of using browser confirm
    this.showDeleteConfirmModal = true;
  }

  confirmDelete(): void {
    if (!this.currentRequest) return;

    this.prayerRequestService.deletePrayerRequest(this.currentRequest.id).subscribe({
      next: () => {
        this.successMessage = 'Prayer request deleted successfully!';
        this.currentRequest = null;
        this.requestForm.reset();
        this.showDeleteConfirmModal = false;
      },
      error: (error) => {
        this.errorMessage = 'Error deleting prayer request. Please try again.';
        console.error('Error deleting prayer request:', error);
        this.showDeleteConfirmModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirmModal = false;
  }
}
