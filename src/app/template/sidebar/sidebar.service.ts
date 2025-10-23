import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importar Observable e of para simulação
import { SidebarItem } from './sidebarItem.interface';

@Injectable({
  providedIn: 'root' // Torna o serviço um Singleton disponível em toda a aplicação
})
export class SidebarService {

  // Lista de itens do menu (simulando dados dinâmicos)
  private menuItems: SidebarItem[] = [
    {
      label: 'Início',
      route: '/',
      icon: 'home',
      isOpen: false // Adicionado estado inicial
    },
    {
      label: 'Cadastro',
      route: '/register',
      icon: 'person_add', // Icon Material
      isOpen: false
    },
    {
      label: 'Escala',
      route: '/schedule',
      icon: 'schedule', // Icon Material
      isOpen: false
    },
    {
      label: 'Juridico',
      route: '/juristic',
      icon: 'gavel', // Icon Material
      isOpen: false,
      children: [
        {
          label: 'Controle de Notificações',
          route: '/juristic/penalty-control',
          icon: 'notifications_active' // Icon Material
        }
      ]
    },
    {
      label: 'Monitora',
      route: '/monitoring',
      icon: 'visibility', // Icon Material
      isOpen: false
    }
  ];

  constructor() { }

  /**
   * Retorna a lista de itens do menu.
   * Usamos um Observable<SidebarItem[]> para simular a chamada assíncrona de uma API.
   */

  getMenuItems(): Observable<SidebarItem[]> {
    return of(this.menuItems);
  }
}
