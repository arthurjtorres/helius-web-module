import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CompanySelectComponent } from './company-select.component';

/** Combobox de empresa compartilhado (tabelas, formulários e importações). */
@NgModule({
    imports: [CommonModule, MatFormFieldModule, MatSelectModule, CompanySelectComponent],
    exports: [CompanySelectComponent],
})
export class CompanySelectModule { }
