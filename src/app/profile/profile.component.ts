import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';
import { User } from '../types/api.types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  user: User | null = null;
  loading = {
    profile: false,
    password: false
  };
  errorMessage = '';
  successMessage = '';
  showPasswordSection = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadUserProfile();
  }

  initializeForms(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUserProfile(): void {
    this.loading.profile = true;
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        });
        this.loading.profile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.loading.profile = false;
        this.toastService.showError('Failed to load profile');
      }
    });
  }

  onUpdateProfile(): void {
    if (this.profileForm.invalid || !this.user) {
      return;
    }

    this.loading.profile = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.profileForm.value;

    this.userService.updateOwnProfile(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Profile updated successfully!';
        this.toastService.showSuccess('Profile updated successfully');
        this.loading.profile = false;

        // Refresh user data in auth service
        this.authService.getCurrentUser().subscribe();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.error?.error || 'Failed to update profile. Please try again.';
        this.toastService.showError('Failed to update profile');
        this.loading.profile = false;
      }
    });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading.password = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.toastService.showSuccess('Password changed successfully');
        this.passwordForm.reset();
        this.showPasswordSection = false;
        this.loading.password = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = error.error?.error || 'Failed to change password. Please check your current password.';
        this.toastService.showError('Failed to change password');
        this.loading.password = false;
      }
    });
  }

  togglePasswordSection(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.passwordForm.reset();
    }
  }

  cancelPasswordChange(): void {
    this.showPasswordSection = false;
    this.passwordForm.reset();
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
