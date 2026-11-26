import { Component } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';

@Component({
    selector: 'app-company-page-content',
    templateUrl: './company-page-content.component.html',
    styleUrl: './company-page-content.component.scss',
    imports: [MatFabButton, MatIcon, MatFormField, MatInput, MatIconButton, MatSuffix, MatDivider]
})
export class CompanyPageContentComponent {

}
