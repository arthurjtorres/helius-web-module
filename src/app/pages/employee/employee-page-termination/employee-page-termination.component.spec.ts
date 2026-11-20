import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { EmployeePageTerminationComponent } from './employee-page-termination.component';
import { EmployeeModule } from '../employee.module';

describe('EmployeePageTerminationComponent', () => {
  it('abre com a data de hoje (fuso local) e a admissão como mínimo', async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { registration: 'ZZT000001', admissionDate: '2020-02-01T00:00:00Z' } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
    const component = TestBed.createComponent(EmployeePageTerminationComponent).componentInstance;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    expect(component.terminationDate).toBe(today);
    expect(component.minDate).toBe('2020-02-01');
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    expect(component.maxDate).toBe(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`);
  });
});
