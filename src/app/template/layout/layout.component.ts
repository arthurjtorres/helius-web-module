import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatDivider } from '@angular/material/list';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    imports: [MatToolbar, MatIconButton, MatIcon, MatMenuTrigger, MatMenu, MatDivider, MatMenuItem, MatSlideToggle, MatSidenavContainer, MatSidenav, SidebarComponent, MatSidenavContent, RouterOutlet, AsyncPipe]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  theme = inject(ThemeService);

  collapsed = signal(false);
  sidebarWidth = computed(() => this.collapsed() ? '60px' : '250px');

  user$ = this.authService.getUser();

  logout() {
    this.authService.logout();
  }
}