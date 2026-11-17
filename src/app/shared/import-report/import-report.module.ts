import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImportReportComponent } from './import-report.component';

/** Relatório de importação em lote, compartilhado por veículos e funcionários. */
@NgModule({
  declarations: [ImportReportComponent],
  imports: [CommonModule, MatCheckboxModule],
  exports: [ImportReportComponent],
})
export class ImportReportModule { }
