import { Component, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { EmployeeView } from '../../../core/interfaces/employee.interface';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

/** Diálogo de desligamento (T20): pede a data de rescisão e a devolve ao fechar (`AAAA-MM-DD`). */
@Component({
    selector: 'app-employee-page-termination',
    templateUrl: './employee-page-termination.component.html',
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
})
export class EmployeePageTerminationComponent {
  data = inject<EmployeeView>(MAT_DIALOG_DATA);

  /** Padrão: hoje, no fuso do navegador. */
  terminationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  /** Máximo do seletor: amanhã (o backend também confere). */
  maxDate = formatDate(Date.now() + 86_400_000, 'yyyy-MM-dd', 'en-US');
  /** Mínimo do seletor: a admissão (o backend também confere). */
  minDate: string;

  constructor() {
    const data = this.data;

    this.minDate = data.admissionDate ? String(data.admissionDate).slice(0, 10) : '';
  }
}
