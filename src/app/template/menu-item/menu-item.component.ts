import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-menu-item',
  standalone: false,
  templateUrl: './menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  item = input.required<MenuItem>();
  isCollapsed = input(false);

  nestedMenuOpen = signal(false);

  toggleNested() {
    if(!this.item().children) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
