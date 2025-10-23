import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  // NOVO: Definimos o estado inicial como colapsado/fechado se for mobile.
  // Usaremos uma verificação inicial para definir o valor.
  isSidebarCollapsed: boolean;
  isMobileOverlayOpen: boolean = false;

  private mobileBreakpoint = 768;

  constructor() {
    this.isSidebarCollapsed = window.innerWidth <= this.mobileBreakpoint;
  }

  // Ouve o evento de redimensionamento para ajustar o estado da barra lateral
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const isMobile = window.innerWidth <= this.mobileBreakpoint;

    // Se a tela se tornar mobile, a sidebar deve ser forçada a fechar.
    // Se a tela se tornar desktop, a sidebar deve ser forçada a expandir (para o estado colapsado do desktop).
    if (isMobile) {
      this.isSidebarCollapsed = true; // Colapsado (Oculto) no mobile
      this.isMobileOverlayOpen = false; // Garante que o overlay feche ao redimensionar
    } else {
      // No Desktop, o estado padrão é expandido (FALSE) e o overlay é irrelevante.
      this.isSidebarCollapsed = false;
      this.isMobileOverlayOpen = false;
    }
  }

  onSidebarToggle() {
    const isMobile = window.innerWidth < this.mobileBreakpoint;

    if (isMobile) {
      // No mobile, o toggle controla o estado de overlay (abrir/fechar a barra de 250px)
      this.isMobileOverlayOpen = !this.isMobileOverlayOpen;

      // Mantemos isSidebarCollapsed em TRUE para manter a barra de 70px (que fica visível)
      this.isSidebarCollapsed = true;
    } else {
      // No desktop, o toggle controla o estado de colapsado (70px vs 250px)
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }
}
