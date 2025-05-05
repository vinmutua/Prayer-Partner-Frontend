import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrayerTheme } from '../../types/api.types';

@Component({
  selector: 'app-theme-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './theme-form.component.html',
  styles: []
})
export class ThemeFormComponent implements OnInit {
  @Input() theme: PrayerTheme | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  themeForm: FormGroup;
  formTitle: string = 'Add New Prayer Theme';
  submitButtonText: string = 'Add Theme';

  constructor(private fb: FormBuilder) {
    this.themeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.theme) {
      this.formTitle = 'Edit Prayer Theme';
      this.submitButtonText = 'Update Theme';

      // Populate form with theme data
      this.themeForm.patchValue({
        title: this.theme.title,
        description: this.theme.description,
        active: this.theme.active
      });
    }
  }

  onSubmit(): void {
    if (this.themeForm.valid) {
      this.save.emit({
        id: this.theme?.id,
        ...this.themeForm.value
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
