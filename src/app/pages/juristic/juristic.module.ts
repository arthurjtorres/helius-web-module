//juristic.module.ts

import { AppealControlComponent } from './appeal-control/appeal-control.component';
import { CTDOPControlComponent } from './ctdop-control/ctdop-control.component';
import { DashboardComponent } from './dashboard/dashboard.component';


import { CommonModule } from '@angular/common';
import { JuristicRoutingModule } from './juristic-routing.module';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSort, MatSortModule, MatSortHeader } from '@angular/material/sort';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatTableModule,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderRowDef
} from '@angular/material/table';
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";






@NgModule({
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
        HttpClientModule,
        BrowserModule,
        MatSort,
        MatSortHeader,
        MatSortModule,
        ReactiveFormsModule,
        DashboardComponent,
        AppealControlComponent,
        CTDOPControlComponent
    ],
    exports: []
})
export class JuristicModule { }


