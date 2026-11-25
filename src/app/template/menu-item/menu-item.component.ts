import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from '../sidebar/sidebar.component';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatListItemMeta } from '@angular/material/list';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './menu-item.component.scss',
    imports: [MatListItem, RouterLinkActive, RouterLink, MatIcon, MatListItemIcon, MatListItemTitle, MatListItemMeta]
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
