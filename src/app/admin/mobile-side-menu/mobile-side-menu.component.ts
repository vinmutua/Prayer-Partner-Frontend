import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-mobile-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-side-menu.component.html',
  styleUrl: './mobile-side-menu.component.scss'
})
export class MobileSideMenuComponent {
  @Input() isOpen: boolean = false;
  @Input() user: User | null = null;
  @Input() activeTab: string = 'users';

  @Output() close = new EventEmitter<void>();
  @Output() tabChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();

  expandedSection: string | null = null;

  // Menu sections with their items
  menuSections = [
    {
      id: 'users',
      title: 'Users',
      icon: 'users',
      items: []
    },
    {
      id: 'pairings',
      title: 'Prayer Pairings',
      icon: 'pairings',
      items: [
        { id: 'generate', title: 'Generate New', icon: 'add' },
        { id: 'clear', title: 'Clear All', icon: 'trash' },
        { id: 'export-csv', title: 'Export CSV', icon: 'download' },
        { id: 'export-pdf', title: 'Export PDF', icon: 'pdf' },
        { id: 'send-emails', title: 'Send Partner Emails', icon: 'email' },
        { id: 'send-reminders', title: 'Send Reminder Emails', icon: 'reminder' }
      ]
    },
    {
      id: 'themes',
      title: 'Prayer Themes',
      icon: 'themes',
      items: [
        { id: 'add-theme', title: 'Add Theme', icon: 'add' },
        { id: 'export-themes', title: 'Export Themes', icon: 'pdf' }
      ]
    },
    {
      id: 'requests',
      title: 'Prayer Requests',
      icon: 'requests',
      items: []
    },
    {
      id: 'my-partners',
      title: 'My Prayer Partners',
      icon: 'my-partners',
      items: []
    }
  ];

  constructor() {}

  toggleSection(sectionId: string): void {
    if (this.expandedSection === sectionId) {
      this.expandedSection = null;
    } else {
      this.expandedSection = sectionId;
    }
  }

  selectTab(tabId: string): void {
    this.tabChange.emit(tabId);
    this.close.emit();
  }

  selectAction(sectionId: string, actionId: string): void {
    this.tabChange.emit(sectionId);

    // Emit the action with a delay to allow the tab to change first
    setTimeout(() => {
      const event = new CustomEvent('admin-action', {
        detail: { section: sectionId, action: actionId }
      });
      window.dispatchEvent(event);
    }, 100);

    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  // View current pairings
  viewCurrentPairings(): void {
    this.tabChange.emit('pairings');
    this.close.emit();
  }

  // View prayer themes
  viewPrayerThemes(): void {
    this.tabChange.emit('themes');
    this.close.emit();
  }

  // Handle logout
  logout(): void {
    this.logoutEvent.emit();
    this.close.emit();
  }

  // Prevent clicks inside the menu from closing it
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Get icon SVG based on icon name
  getIconSvg(iconName: string): string {
    switch (iconName) {
      case 'users':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>`;
      case 'pairings':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>`;
      case 'themes':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
                  <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
                </svg>`;
      case 'requests':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>`;
      case 'my-partners':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>`;
      case 'add':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>`;
      case 'trash':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>`;
      case 'download':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>`;
      case 'pdf':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>`;
      case 'email':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>`;
      case 'reminder':
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>`;
    }
  }
}
