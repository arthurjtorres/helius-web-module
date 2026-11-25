import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CompanySelectModule } from '../../shared/company-select/company-select.module';
import { UserCompaniesPageComponent } from './user-companies-page/user-companies-page.component';

/** Telas do `control` (permissões e acessos). */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatTooltipModule,
        CompanySelectModule,
        UserCompaniesPageComponent,
    ]
})
export class ControlModule { }
