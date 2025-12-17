import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './template/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

import { PenaltyControlComponent } from './pages/juristic/penalty-control/penalty-control.component';
import { DashboardComponent } from './pages/juristic/dashboard/dashboard.component';
import { CTDOPControlComponent } from './pages/juristic/ctdop-control/ctdop-control.component';
import { AppealControlComponent } from './pages/juristic/appeal-control/appeal-control.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

import { ApendixComponent } from './pages/juristic/apendix/apendix.component';
import { PersonnelComponent } from './pages/human-resources/personnel/personnel.component';
import { CorporateComponent } from './pages/human-resources/corporate/corporate.component';
import { RegisterEmployeeComponent } from './pages/human-resources/register-employee/register-employee.component';


const routes: Routes = [
  // 1. Rota principal que carrega o MainLayoutComponent
  {
    path: '', // Define o caminho base

    component: LayoutComponent, // O componente a ser carregado
    children: [ // As rotas aninhadas serão injetadas no <router-outlet> DENTRO do LayoutComponent
      {
        path: '', // A rota vazia ('/')
        pathMatch: 'full',
        component: HomeComponent // Carrega o HomeComponent dentro do layout
      },

      {
        path: 'human-resources/personnel',
        component: PersonnelComponent,
      },
      {
        path: 'human-resources/register-employee',
        component: RegisterEmployeeComponent,
      },
      {
        path: 'human-resources/corporate',
        component: CorporateComponent,
      },
     
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'juristic',
        component: DashboardComponent,

      },
      {
        path: 'juristic/penalty-control',
        component: PenaltyControlComponent,
      },
      {
        path: 'juristic/ctdop',
        component: CTDOPControlComponent,
      },
      {
        path: 'juristic/appeal',
        component: AppealControlComponent,
      },
      {
        path: 'juristic/apendix',
        component: ApendixComponent,
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
