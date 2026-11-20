import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { OutsideListComponent } from './outside-list.component';

/** Lista "fora da planilha" com desativação em lote, compartilhada por veículos e funcionários. */
@NgModule({
  declarations: [OutsideListComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatListModule],
  exports: [OutsideListComponent],
})
export class OutsideListModule { }
