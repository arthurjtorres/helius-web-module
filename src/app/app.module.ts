import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateModule } from './template/template.module';
import { HomeComponent } from './pages/home/home.component';
import { PenaltyControlComponent } from './pages/juristic/penalty-control/penalty-control.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { RegistryComponent } from './pages/registry/registry.component';
import { DashboardComponent } from './pages/juristic/dashboard/dashboard.component';
import { AppealControlComponent } from './pages/juristic/appeal-control/appeal-control.component';
import { CTDOPControlComponent } from './pages/juristic/ctdop-control/ctdop-control.component';
import { ApendixComponent } from './pages/juristic/apendix/apendix.component';
import { MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCellDef, MatHeaderRowDef } from "@angular/material/table";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PenaltyControlComponent,
    ScheduleComponent,
    RegistryComponent,
    DashboardComponent,
    AppealControlComponent,
    CTDOPControlComponent,
    ApendixComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TemplateModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
