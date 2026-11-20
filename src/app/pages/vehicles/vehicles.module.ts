import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { VehiclesContentComponent } from './vehicles-content/vehicles-content.component';
import { VehiclePageComponent } from './vehicle-page/vehicle-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ImportReportModule } from '../../shared/import-report/import-report.module';
import { CompanySelectModule } from '../../shared/company-select/company-select.module';
import { OutsideListModule } from '../../shared/outside-list/outside-list.module';
import { VehiclesImportComponent } from './vehicles-import/vehicles-import.component';
import { VehiclesFormComponent } from './vehicles-form/vehicles-form.component';
import { VehicleTypePageComponent } from './vehicle-type-page/vehicle-type-page.component';
import { VehicleTypeFormComponent } from './vehicle-type-form/vehicle-type-form.component';


@NgModule({
  declarations: [
    VehiclesContentComponent,
    VehiclePageComponent,
    VehiclesImportComponent,
    VehiclesFormComponent,
    VehicleTypePageComponent,
    VehicleTypeFormComponent,
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,  
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatCardModule,
    ImportReportModule,
    CompanySelectModule,
    OutsideListModule,
  ]
})
export class VehiclesModule { }
