import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JuristicRoutingModule } from './juristic-routing.module';

import {MatTableModule} from '@angular/material/table';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    JuristicRoutingModule
  ]
})
export class JuristicModule { }


