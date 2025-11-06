//juristic.module.ts
import { RegistryComponent } from '../registry/registry.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { ApendixComponent } from './apendix/apendix.component';
import { AppealControlComponent } from './appeal-control/appeal-control.component';
import { CTDOPControlComponent } from './ctdop-control/ctdop-control.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PenaltyControlComponent } from './penalty-control/penalty-control.component';


import { CommonModule } from '@angular/common';
import { JuristicRoutingModule } from './juristic-routing.module';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { AfterViewInit, Component, ViewChild, inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatTableModule,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatTableDataSource,
  MatHeaderRowDef
} from '@angular/material/table';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";


@NgModule({
  declarations: [
    PenaltyControlComponent,
    ScheduleComponent,
    RegistryComponent,
    DashboardComponent,
    AppealControlComponent,
    CTDOPControlComponent,
    ApendixComponent,

  ],
  imports: [
    JuristicRoutingModule,
    RouterModule,
    CommonModule,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatTabsModule,
    MatPaginator,
    MatPaginatorModule,
    MatSortModule,
    MatDivider,
    MatInputModule,
    MatIcon,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    FormsModule, 
    MatFormFieldModule, 
    
],

  exports: [

  ]
})
export class JuristicModule { }


