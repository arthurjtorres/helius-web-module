import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService = inject(AuthService);

  isDarkMode = false;
  collapsed = signal(false);
  sidebarWidth = computed(() => this.collapsed() ? '60px' : '250px');

  user$ = this.authService.getUser();

  ngOnInit() {
    const savedTheme = localStorage.getItem('helius_dark_mode') === 'true';
    if (savedTheme) {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }

  toggleDarkMode(enabled: boolean) {
    this.isDarkMode = enabled;

    if (enabled) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('helius_dark_mode', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('helius_dark_mode', 'false');
    }
  }

  logout() {
    this.authService.logout();
  }
  
}
