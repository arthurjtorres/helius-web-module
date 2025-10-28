import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TemplateRoutingModule } from './template-routing.module';
//import { BodyComponent } from './body/body.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';




@NgModule({
  declarations: [
    //BodyComponent,
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,


  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,

  ]
})
export class TemplateModule { }
