import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../types/api.types';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styles: []
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  formTitle: string = 'Add New User';
  submitButtonText: string = 'Add User';

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.user ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['MEMBER', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.formTitle = 'Edit User';
      this.submitButtonText = 'Update User';

      // Remove password validator for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();

      // Populate form with user data
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
        active: this.user.active
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      // If password is empty and we're editing, remove it from the payload
      if (this.user && !userData.password) {
        delete userData.password;
      }

      this.save.emit({
        id: this.user?.id,
        ...userData
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
