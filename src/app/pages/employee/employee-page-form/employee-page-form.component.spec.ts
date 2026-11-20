import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageFormComponent } from './employee-page-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeModule } from '../employee.module';
import { of } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';

describe('EmployeePageFormComponent', () => {
  let component: EmployeePageFormComponent;
  let fixture: ComponentFixture<EmployeePageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: MatDialogRef, useValue: { close: () => undefined } }, { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cargo, setor e departamento são opcionais e, vazios, saem do payload (a API recusa "")', () => {
    const create = spyOn(TestBed.inject(EmployeeService), 'create').and.returnValue(of({ registration: '900001', fkPersonId: 'p1' }));
    component.isEdit = false;
    component.employeeForm.patchValue({
      personId: 'p1', cpf: '52998224725', registration: '900001', fullName: 'ZZ_TEST_ Demissao',
      birthDate: '1990-01-01', admissionDate: '2026-01-02', company: 'c1',
    });
    expect(component.employeeForm.valid).toBeTrue();
    component.onSave();
    const payload = create.calls.mostRecent().args[0];
    expect(JSON.parse(JSON.stringify(payload))).toEqual({ registration: '900001', admissionDate: '2026-01-02', fkPersonId: 'p1', fkCompanyId: 'c1' });
  });
});
