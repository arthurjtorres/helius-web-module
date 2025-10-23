import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
    TemplateRoutingModule
  ],
  exports: [
    LayoutComponent,
    SidebarComponent,

  ]
})
export class TemplateModule { }
