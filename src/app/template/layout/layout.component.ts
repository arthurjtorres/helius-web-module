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

  collapsed = signal(false);
  sidebarWidth = computed(() => this.collapsed() ? '60px' : '250px');

  user$ = this.authService.getUser();

  logout(){
    this.authService.logout();
  }
}
