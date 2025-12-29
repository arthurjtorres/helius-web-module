import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppendixRoutingModule } from './appendix-routing.module';
import { FineCodePageComponent } from './fine-code-page/fine-code-page.component';
import { AppendixContentComponent } from './appendix-content/appendix-content.component';
import { FineCodeFormComponent } from './fine-code-form/fine-code-form.component';
import { MotiveComponent } from './motive/motive.component';
import { MatIconModule } from "@angular/material/icon";
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    FineCodePageComponent,
    AppendixContentComponent,
    FineCodeFormComponent,
    MotiveComponent
  ],
  imports: [
    CommonModule,
    AppendixRoutingModule,
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
export class AppendixModule { }
