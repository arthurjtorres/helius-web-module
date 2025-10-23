import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './template/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

import { PenaltyControlComponent } from './pages/juristic/penalty-control/penalty-control.component';


const routes: Routes = [
  // 1. Rota principal que carrega o MainLayoutComponent
  {
    path: '', // Define o caminho base
    component: LayoutComponent, // O componente a ser carregado
    children: [ // As rotas aninhadas serão injetadas no <router-outlet> DENTRO do LayoutComponent
      {
        path: '', // A rota vazia ('/')
        component: HomeComponent // Carrega o HomeComponent dentro do layout
      },
      // Outras rotas iriam aqui (ex: path: 'products', component: ProductsComponent)
      // ROTAS ANINHADAS PARA 'JURIDICO'
      {
        path: 'juristic/penalty-control',
        component: PenaltyControlComponent
      }
    ]
  },
  
  // 2. Rota de tratamento de erro 404 (opcional, mas bom ter)
  // { path: '**', component: NotFoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
