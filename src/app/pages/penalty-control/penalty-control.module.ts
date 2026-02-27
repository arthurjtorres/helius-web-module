import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PenaltyControlRoutingModule } from './penalty-control-routing.module';
import { PenaltyPageComponent } from './penalty-page/penalty-page.component';
import { PenaltyContentComponent } from './penalty-content/penalty-content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PenaltyDetailsComponent } from './penalty-details/penalty-details.component';


@NgModule({
  declarations: [
    PenaltyPageComponent,
    PenaltyContentComponent,
    PenaltyDetailsComponent
  ],
  imports: [
    CommonModule,
    PenaltyControlRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class PenaltyControlModule { }
