import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrayerPairing } from '../../../types/api.types';

@Component({
  selector: 'app-email-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-modal.component.html',
  styleUrl: './email-modal.component.scss'
})
export class EmailModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() pairing: PrayerPairing | null = null;
  @Input() isAllPairings: boolean = false;
  @Input() isReminder: boolean = false;
  
  @Output() close = new EventEmitter<void>();
  @Output() send = new EventEmitter<{
    pairingId?: number;
    customMessage?: string;
    isAllPairings: boolean;
    isReminder: boolean;
  }>();
  
  emailForm: FormGroup;
  isSubmitting = false;
  
  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      customMessage: ['', [Validators.maxLength(500)]]
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  ngOnChanges(): void {
    this.resetForm();
  }
  
  resetForm(): void {
    this.emailForm.reset({
      customMessage: ''
    });
  }
  
  onClose(): void {
    this.close.emit();
  }
  
  onSubmit(): void {
    if (this.emailForm.invalid) return;
    
    this.isSubmitting = true;
    
    const emailData = {
      pairingId: this.pairing?.id,
      customMessage: this.emailForm.value.customMessage,
      isAllPairings: this.isAllPairings,
      isReminder: this.isReminder
    };
    
    this.send.emit(emailData);
    this.isSubmitting = false;
  }
  
  // Prevent clicks inside the modal from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  get formControls() {
    return this.emailForm.controls;
  }
  
  get modalTitle(): string {
    if (this.isReminder) {
      return 'Send Reminder Emails';
    } else if (this.isAllPairings) {
      return 'Send Emails to All Prayer Partners';
    } else if (this.pairing) {
      return `Send Email to ${this.pairing.partner1.firstName} and ${this.pairing.partner2.firstName}`;
    }
    return 'Send Email';
  }
  
  get modalDescription(): string {
    if (this.isReminder) {
      return 'This will send reminder emails to all users to submit their prayer requests.';
    } else if (this.isAllPairings) {
      return 'This will send emails to all current prayer partners with their pairing information.';
    } else if (this.pairing) {
      return `This will send an email to ${this.pairing.partner1.firstName} ${this.pairing.partner1.lastName} and ${this.pairing.partner2.firstName} ${this.pairing.partner2.lastName} with their pairing information.`;
    }
    return 'Send an email notification.';
  }
  
  get buttonText(): string {
    if (this.isReminder) {
      return 'Send Reminders';
    } else if (this.isAllPairings) {
      return 'Send to All Partners';
    } else {
      return 'Send Email';
    }
  }
}
