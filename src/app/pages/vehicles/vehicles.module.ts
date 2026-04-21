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
import { VehiclesImportComponent } from './vehicles-import/vehicles-import.component';
import { VehiclesFormComponent } from './vehicles-form/vehicles-form.component';


@NgModule({
  declarations: [
    VehiclesContentComponent,
    VehiclePageComponent,
    VehiclesImportComponent,
    VehiclesFormComponent
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
    
  ]
})
export class VehiclesModule { }
