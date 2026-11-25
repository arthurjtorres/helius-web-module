import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageFormComponent } from './employee-page-form.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeModule } from '../employee.module';
import { of } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { PersonService } from '../../../core/services/person.service';
import { DocumentService } from '../../../core/services/document.service';
import { DocumentInterface } from '../../../core/interfaces/document.interface';

describe('EmployeePageFormComponent', () => {
  let component: EmployeePageFormComponent;
  let fixture: ComponentFixture<EmployeePageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting(), { provide: MatDialogRef, useValue: { close: () => undefined } }, { provide: MAT_DIALOG_DATA, useValue: {} }]
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

  it('exige nome e sobrenome, como a importação (o registry recusa lastName vazio)', () => {
    const fullName = component.employeeForm.get('fullName')!;
    fullName.setValue('ZZ_TEST_Demissao');
    expect(fullName.valid).toBeFalse();
    fullName.setValue('ZZ_TEST_ Demissao');
    expect(fullName.valid).toBeTrue();
  });

  it('divide o nome por qualquer espaço em branco', () => {
    const create = spyOn(TestBed.inject(PersonService), 'create').and.returnValue(of({ data: { personId: 'p1' } }) as never);
    spyOn(TestBed.inject(DocumentService), 'create').and.returnValue(of({} as DocumentInterface));
    spyOn(TestBed.inject(EmployeeService), 'create').and.returnValue(of({ registration: '900001', fkPersonId: 'p1' }));
    component.isEdit = false;
    component.employeeForm.patchValue({
      cpf: '52998224725', registration: '900001', fullName: ' ZZ_TEST_   Demissao  Silva ',
      birthDate: '1990-01-01', admissionDate: '2026-01-02', company: 'c1',
    });
    component.onSave();
    expect(create.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ firstName: 'ZZ_TEST_', lastName: 'Demissao Silva' }));
  });
});
