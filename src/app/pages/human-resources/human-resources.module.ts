import { NgModule, ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HumanResourcesRoutingModule } from './human-resources-routing.module';

import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCellDef, MatTableDataSource, MatHeaderRowDef, MatRecycleRows, MatTable } from '@angular/material/table';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { MatDivider } from "@angular/material/divider";
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    
    
    RegisterEmployeeComponent
  ],
  imports: [
    CommonModule,
    HumanResourcesRoutingModule,
    MatIcon,
    MatFormField,
    MatTabGroup,
    MatTab,
    MatButtonModule,
    MatRecycleRows,
    MatTable,
    MatDivider,
    MatLabel,
    MatCardModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatSelectModule
]
})
export class HumanResourcesModule { }
