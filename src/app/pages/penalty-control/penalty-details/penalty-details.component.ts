import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { PenaltyCompositeView } from '../../../core/interfaces/penalty.interface';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-penalty-details',
    templateUrl: './penalty-details.component.html',
    styleUrl: './penalty-details.component.scss',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, DatePipe]
})
export class PenaltyDetailsComponent {  dialogRef = inject<MatDialogRef<PenaltyDetailsComponent>>(MatDialogRef);
  data = inject<PenaltyCompositeView>(MAT_DIALOG_DATA);

}
