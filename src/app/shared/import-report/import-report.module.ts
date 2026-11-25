import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ImportReportComponent } from './import-report.component';

/** Relatório de importação em lote, compartilhado por veículos e funcionários. */
@NgModule({
    imports: [CommonModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatListModule, MatTableModule, ImportReportComponent],
    exports: [ImportReportComponent],
})
export class ImportReportModule { }
