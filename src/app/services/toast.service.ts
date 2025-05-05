import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private lastId = 0;

  constructor() {}

  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  showSuccess(message: string, timeout: number = 3000): void {
    this.show(message, 'success', timeout);
  }

  showError(message: string, timeout: number = 3000): void {
    this.show(message, 'error', timeout);
  }

  showInfo(message: string, timeout: number = 3000): void {
    this.show(message, 'info', timeout);
  }

  showWarning(message: string, timeout: number = 3000): void {
    this.show(message, 'warning', timeout);
  }

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning', timeout: number): void {
    const id = ++this.lastId;

    const toast: Toast = {
      id,
      message,
      type,
      timeout
    };

    this.toasts = [...this.toasts, toast];
    this.toastsSubject.next(this.toasts);

    setTimeout(() => {
      this.remove(id);
    }, timeout);
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}
