import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatIconButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatTable, MatColumnDef } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-motive-page',
    templateUrl: './motive-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './motive-page.component.scss',
    imports: [MatFormField, MatInput, MatIconButton, MatSuffix, MatIcon, MatFabButton, MatDivider, MatTable, MatSort, MatColumnDef]
})
export class MotivePageComponent {

}
