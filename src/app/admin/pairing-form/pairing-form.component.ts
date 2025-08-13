import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrayerTheme } from '../../types/api.types';

@Component({
  selector: 'app-pairing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pairing-form.component.html',
  styles: []
})
export class PairingFormComponent implements OnInit {
  @Input() themes: PrayerTheme[] = [];
  @Output() generate = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  pairingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Set default dates (today and 30 days from now)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    this.pairingForm = this.fb.group({
      startDate: [this.formatDateForInput(today), Validators.required],
      endDate: [this.formatDateForInput(nextMonth), Validators.required],
      themeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // If there are active themes, select the first one by default
    const activeThemes = this.themes.filter(theme => theme.active);
    if (activeThemes.length > 0) {
      this.pairingForm.patchValue({
        themeId: activeThemes[0].id
      });
    }
  }

  onSubmit(): void {
    if (this.pairingForm.valid) {
      this.generate.emit(this.pairingForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getActiveThemeCount(): number {
    return this.themes.filter(theme => theme.active).length;
  }

  // Helper method to format date for input[type="date"]
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
