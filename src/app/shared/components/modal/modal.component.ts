import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
