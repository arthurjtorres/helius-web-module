import { Component, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeView } from '../../../core/interfaces/employee.interface';

/** Diálogo de desligamento (T20): pede a data de rescisão e a devolve ao fechar (`AAAA-MM-DD`). */
@Component({
  selector: 'app-employee-page-termination',
  standalone: false,
  templateUrl: './employee-page-termination.component.html',
})
export class EmployeePageTerminationComponent {
  /** Padrão: hoje, no fuso do navegador. */
  terminationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  /** Máximo do seletor: amanhã (o backend também confere). */
  maxDate = formatDate(Date.now() + 86_400_000, 'yyyy-MM-dd', 'en-US');
  /** Mínimo do seletor: a admissão (o backend também confere). */
  minDate: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmployeeView) {
    this.minDate = data.admissionDate ? String(data.admissionDate).slice(0, 10) : '';
  }
}
