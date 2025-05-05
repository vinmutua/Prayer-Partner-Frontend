import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerRequest } from '../../../types/api.types';

@Component({
  selector: 'app-prayer-request-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-request-modal.component.html',
  styleUrl: './prayer-request-modal.component.scss'
})
export class PrayerRequestModalComponent {
  @Input() isOpen: boolean = false;
  @Input() prayerRequest: PrayerRequest | null = null;
  @Input() partnerName: string = '';
  
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
