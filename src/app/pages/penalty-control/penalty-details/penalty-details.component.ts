import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PenaltyCompositeView } from '../../../core/interfaces/penalty.interface';

@Component({
  selector: 'app-penalty-details',
  standalone: false,
  templateUrl: './penalty-details.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './penalty-details.component.scss'
})
export class PenaltyDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<PenaltyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PenaltyCompositeView
  ) {}
}
