import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrayerPartner } from '../../../services/prayer-partner.service';

@Component({
  selector: 'app-no-prayer-request-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-prayer-request-modal.component.html',
  styleUrl: './no-prayer-request-modal.component.scss'
})
export class NoPrayerRequestModalComponent {
  @Input() isOpen: boolean = false;
  @Input() partnerName: string = '';
  @Input() partner: PrayerPartner | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() sendEmail = new EventEmitter<PrayerPartner>();

  onClose(): void {
    this.close.emit();
  }

  onSendEmail(): void {
    if (this.partner) {
      this.sendEmail.emit(this.partner);
    }
  }

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
