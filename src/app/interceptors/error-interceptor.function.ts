import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Server is not responding. Please try again later.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}, Message: ${error.message}`;
        }
        
        // Handle specific status codes
        switch (error.status) {
          case 401:
            // Unauthorized - handled by auth interceptor
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action';
            router.navigate(['/dashboard']);
            break;
          case 404:
            errorMessage = 'The requested resource was not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later or contact support.';
            break;
        }
      }
      
      // Show error message to user
      toastService.showError(errorMessage);
      
      // Log error to console in development
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error('API Error:', error);
      }
      
      return throwError(() => error);
    })
  );
};
