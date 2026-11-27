import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageFormComponent } from './employee-page-form.component';
import { HttpErrorResponse, provideHttpClient, withXhr } from '@angular/common/http';
import { throwError } from 'rxjs';
import { PositionService } from '../../../core/services/position.service';
import { SectorService } from '../../../core/services/sector.service';
import { DepartmentService } from '../../../core/services/department.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmployeeView } from '../../../core/interfaces/employee.interface';
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

  it('lista vazia (404) em setor e departamento não impede a de cargos nem o preenchimento na edição', () => {
    const empty = throwError(() => new HttpErrorResponse({ status: 404 }));
    const cargo = { positionId: 'c1', positionName: 'ZZ_TEST_' };
    spyOn(TestBed.inject(PositionService), 'getAll').and.returnValue(of({ data: [cargo] }) as never);
    spyOn(TestBed.inject(SectorService), 'getAll').and.returnValue(empty);
    spyOn(TestBed.inject(DepartmentService), 'getAll').and.returnValue(empty);
    component.isEdit = true;
    component.data = { fkPositionId: 'c1' } as EmployeeView;

    const toast = spyOn(TestBed.inject(NotificationService), 'error');

    component.loadResources();

    expect(toast).not.toHaveBeenCalled();
    expect(component.positions()).toEqual([cargo] as never);
    expect(component.sectors()).toEqual([]);
    expect(component.employeeForm.get('position')?.value).toBe('c1');
  });

  it('outro erro numa lista avisa na tela', () => {
    spyOn(TestBed.inject(SectorService), 'getAll').and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    const toast = spyOn(TestBed.inject(NotificationService), 'error');

    component.loadResources();

    expect(toast).toHaveBeenCalledWith('Não foi possível carregar setores.');
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
