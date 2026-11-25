import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeePageContentComponent } from './employee-page-content/employee-page-content.component';
import { EmployeePageImportComponent } from './employee-page-import/employee-page-import.component';
import { EmployeePageFormComponent } from './employee-page-form/employee-page-form.component';
import { EmployeePageTerminationComponent } from './employee-page-termination/employee-page-termination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ImportReportModule } from '../../shared/import-report/import-report.module';
import { CompanySelectModule } from '../../shared/company-select/company-select.module';
import { InactiveToggleModule } from '../../shared/inactive-toggle/inactive-toggle.module';
import { OutsideListModule } from '../../shared/outside-list/outside-list.module';


@NgModule({
    imports: [
        CommonModule,
        EmployeeRoutingModule,
        MatIconModule,
        MatFormFieldModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        ImportReportModule,
        CompanySelectModule,
        InactiveToggleModule,
        OutsideListModule,
        EmployeePageContentComponent,
        EmployeePageImportComponent,
        EmployeePageFormComponent,
        EmployeePageTerminationComponent
    ]
})
export class EmployeeModule { }
