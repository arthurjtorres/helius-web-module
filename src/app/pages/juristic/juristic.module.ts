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
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { AfterViewInit, Component, ViewChild, inject, NgModule } from '@angular/core';

import {
  MatTableModule,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatTableDataSource,
  MatHeaderRowDef
} from '@angular/material/table';

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
    CommonModule,
    MatTableModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatTabsModule
  ],

  exports: [

  ]
})
export class JuristicModule { }


