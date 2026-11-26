import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatCheckbox } from '@angular/material/checkbox';

/**
 * Checkbox "Ocultar inativos" das tabelas (T17), marcado ao abrir a tela.
 * Só aparece para quem pode ver inativos no menu; emite `true` quando os inativos devem ser listados.
 */
@Component({
    selector: 'app-inactive-toggle',
    template: `@if (visible) {
    <mat-checkbox [checked]="true" (change)="includeInactiveChange.emit(!$event.checked)">Ocultar inativos</mat-checkbox>
  }`,
    imports: [MatCheckbox],
})
export class InactiveToggleComponent implements OnInit {
  private auth = inject(AuthService);

  /** Menu da tela (`menu.menu_name`), ex.: `FUNCIONARIOS`. */
  @Input({ required: true }) menu!: string;
  @Output() includeInactiveChange = new EventEmitter<boolean>();
  visible = false;

  ngOnInit(): void {
    this.visible = this.auth.canSeeInactive(this.menu);
  }
}
