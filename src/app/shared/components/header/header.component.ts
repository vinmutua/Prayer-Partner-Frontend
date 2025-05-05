import { Component, OnInit, OnDestroy, HostListener, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../types/api.types';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isAdmin = false;
  isScrolled = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user observable
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.role === 'ADMIN';
    });

    // Add logo-container class to the logo element
    const logoElement = this.el.nativeElement.querySelector('.flex-shrink-0');
    if (logoElement) {
      this.renderer.addClass(logoElement, 'logo-container');
    }

    // Add logo-icon class to the SVG icon
    const logoIcon = this.el.nativeElement.querySelector('.relative');
    if (logoIcon) {
      this.renderer.addClass(logoIcon, 'logo-icon');
    }

    // Add nav-link class to navigation links
    const navLinks = this.el.nativeElement.querySelectorAll('nav a');
    navLinks.forEach((link: Element) => {
      this.renderer.addClass(link, 'nav-link');
    });

    // Add user-avatar class to the user avatar
    const userAvatar = this.el.nativeElement.querySelector('.h-8.w-8.rounded-full');
    if (userAvatar) {
      this.renderer.addClass(userAvatar, 'user-avatar');
    }

    // Add dropdown-menu class to the dropdown
    const dropdown = this.el.nativeElement.querySelector('.group-hover\\:block');
    if (dropdown) {
      this.renderer.addClass(dropdown, 'dropdown-menu');
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 10) {
      this.isScrolled = true;
      this.renderer.addClass(this.el.nativeElement.querySelector('header'), 'scrolled');
    } else {
      this.isScrolled = false;
      this.renderer.removeClass(this.el.nativeElement.querySelector('header'), 'scrolled');
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close dropdown when clicking outside
    const dropdownElement = this.el.nativeElement.querySelector('.md\\:flex.items-center.mr-4');
    if (dropdownElement && !dropdownElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.isDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
