import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { SidebarItem } from './sidebarItem.interface';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  // menuItems AGORA é do tipo SidebarItem[] e será preenchido pelo serviço
  menuItems: SidebarItem[] = []; // Variável para armazenar a lista de itens

  constructor(private sidebarService: SidebarService) { }
  // Injeção de Dependência do Serviço
  ngOnInit(): void {
    // Ao iniciar, subscrevemos ao Observable do serviço para obter os dados
    this.sidebarService.getMenuItems().subscribe(items => {
      this.menuItems = items;
    });
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(item: SidebarItem) { // Usando SidebarItem
    // Apenas alterna a abertura se o item tiver filhos E o sidebar NÃO estiver colapsado
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  //menuItems: SidebarItem[] = []; // Variável para armazenar a lista de itens



}
