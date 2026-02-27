import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './template/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

import { PenaltyContentComponent } from './pages/penalty-control/penalty-content/penalty-content.component';
import { DashboardComponent } from './pages/juristic/dashboard/dashboard.component';
import { CTDOPControlComponent } from './pages/juristic/ctdop-control/ctdop-control.component';
import { AppealControlComponent } from './pages/juristic/appeal-control/appeal-control.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

import { AppendixContentComponent } from './pages/appendix/appendix-content/appendix-content.component';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { EmployeePageContentComponent } from './pages/employee/employee-page-content/employee-page-content.component';


const routes: Routes = [
  // 1. Rota principal que carrega o MainLayoutComponent
  {
    path: 'login',
    component: LandingpageComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'home', // Define o caminho base
    component: LayoutComponent, // O componente a ser carregado
    canActivate: [authGuard],
    children: [ // As rotas aninhadas serão injetadas no <router-outlet> DENTRO do LayoutComponent
      {
        path: '', // A rota vazia ('/')
        component: HomeComponent // Carrega o HomeComponent dentro do layout
      },

      {
        path: 'human-resources/personnel',
        component: EmployeePageContentComponent,
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
        component: PenaltyContentComponent,
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
        path: 'juristic/appendix',
        component: AppendixContentComponent,
      }
    ]
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
