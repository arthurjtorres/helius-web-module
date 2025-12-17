import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';

export type MenuItem = {
  label?: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {

  isSidebarCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.isSidebarCollapsed.set(val)
  };
  
  menuItems = signal<MenuItem[]>([
    {
      label: 'Início',
      route: '/',
      icon: 'home',
      //isOpen: false // Adicionado estado inicial
    },
    {
      label: 'SRH',
      route: 'human-resources',
      icon: 'person_add', // Icon Material
      //isOpen: false
      children: [
        {
          label: 'Pessoal',
          route: 'personnel',
          icon: 'person',
        },
        {
          label: 'Cadastrar Funcionário',
          route: 'register-employee',
          icon: 'person_add',
        },
        {
          label: 'Corporativo',
          route: 'corporate',
          icon: 'person',
        },
      ]
    },
    {
      label: 'Escala',
      route: 'schedule',
      icon: 'schedule', // Icon Material
      //isOpen: false
    },
    {
      label: 'Juridico',
      route: 'juristic',
      icon: 'balance', // Icon Material
      //isOpen: false,
      children: [
        {
          label: 'Controle de Notificações',
          route: 'penalty-control',
          icon: 'announcement' // Icon Material
        },
        {
          label: 'CTDOP',
          route: 'ctdop',
          icon: 'library_books' // Icon Material          
        },
        {
          label: 'Recursos',
          route: 'appeal',
          icon: 'gavel' // Icon Material          
        },
        {
          label: 'Índice',
          route: 'apendix',
          icon: 'info' // Icon Material          
        },

      ]
    },
    {
      label: 'Monitora',
      route: '/monitoring',
      icon: 'visibility', // Icon Material
      //isOpen: false
    }
  ])



}
