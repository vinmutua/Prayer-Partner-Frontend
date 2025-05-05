import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      @for (toast of toasts; track toast.id) {
        <div
          class="toast p-4 rounded-lg shadow-xl flex items-center justify-between min-w-[300px] max-w-md animate-toast-in"
          [ngClass]="{
            'bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/80 dark:border-green-500 dark:text-green-300': toast.type === 'success',
            'bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/80 dark:border-red-500 dark:text-red-300': toast.type === 'error',
            'bg-blue-100 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/80 dark:border-blue-500 dark:text-blue-300': toast.type === 'info',
            'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900/80 dark:border-yellow-500 dark:text-yellow-300': toast.type === 'warning'
          }"
        >
          <div class="flex items-center">
            <span class="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2">
              <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-yellow-500 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </span>
            <div>{{ toast.message }}</div>
          </div>
          <button
            class="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            (click)="closeToast(toast.id)"
            aria-label="Close"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      animation: toastIn 0.3s ease-out forwards;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .animate-toast-in {
      animation: toastIn 0.3s ease-out forwards;
    }

    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  closeToast(id: number): void {
    this.toastService.remove(id);
  }
}
