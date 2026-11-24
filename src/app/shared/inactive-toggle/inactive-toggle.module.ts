import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InactiveToggleComponent } from './inactive-toggle.component';

/** Checkbox "Ocultar inativos" compartilhado pelas tabelas (T17). */
@NgModule({
  declarations: [InactiveToggleComponent],
  imports: [CommonModule, MatCheckboxModule],
  exports: [InactiveToggleComponent],
})
export class InactiveToggleModule { }
