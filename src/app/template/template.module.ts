import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TemplateRoutingModule } from './template-routing.module';
//import { BodyComponent } from './body/body.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { MenuItemComponent } from './menu-item/menu-item.component';




@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TemplateRoutingModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatSidenavModule,
        FormsModule,
        MatSlideToggleModule,
        //BodyComponent,
        LayoutComponent,
        SidebarComponent,
        MenuItemComponent,
    ],
    exports: [
        LayoutComponent,
        SidebarComponent,
    ]
})
export class TemplateModule { }
