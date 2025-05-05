import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrayerRequest } from '../../../types/api.types';

@Component({
  selector: 'app-prayer-request-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prayer-request-edit-modal.component.html',
  styleUrl: './prayer-request-edit-modal.component.scss'
})
export class PrayerRequestEditModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() prayerRequest: PrayerRequest | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{id: number, content: string, isActive: boolean}>();
  
  requestForm: FormGroup;
  isSubmitting = false;
  
  constructor(private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]],
      isActive: [true]
    });
  }
  
  ngOnInit(): void {
    this.resetForm();
  }
  
  ngOnChanges(): void {
    this.resetForm();
  }
  
  resetForm(): void {
    if (this.prayerRequest) {
      this.requestForm.patchValue({
        content: this.prayerRequest.content,
        isActive: this.prayerRequest.isActive
      });
    } else {
      this.requestForm.reset({
        content: '',
        isActive: true
      });
    }
  }
  
  onClose(): void {
    this.close.emit();
  }
  
  onSubmit(): void {
    if (this.requestForm.invalid || !this.prayerRequest) return;
    
    this.isSubmitting = true;
    
    const updatedRequest = {
      id: this.prayerRequest.id,
      content: this.requestForm.value.content,
      isActive: this.requestForm.value.isActive
    };
    
    this.save.emit(updatedRequest);
    this.isSubmitting = false;
  }
  
  // Prevent clicks inside the modal from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  get formControls() {
    return this.requestForm.controls;
  }
}
