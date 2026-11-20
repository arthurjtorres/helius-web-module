import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { EmployeePageContentComponent } from './employee-page-content.component';
import { EmployeeModule } from '../employee.module';
import { EmployeeService } from '../../../core/services/employee.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('EmployeePageContentComponent', () => {
  let service: jasmine.SpyObj<EmployeeService>;
  let notification: jasmine.SpyObj<NotificationService>;
  const apiEmployee = { employeeId: 'e1', registration: 'ZZT000001', fkCompanyId: 'c1', Person: { fullName: 'ZZ_TEST_ MARIA' }, Company: { companyName: 'ZZ_TEST_ EMPRESA' } };

  function create(companyId = '') {
    const fixture = TestBed.createComponent(EmployeePageContentComponent);
    fixture.componentInstance.companyId = companyId;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<EmployeeService>('EmployeeService', ['getByCompany', 'delete']);
    service.getByCompany.and.returnValue(of({ data: [apiEmployee] }));
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [
        { provide: EmployeeService, useValue: service },
        { provide: CompanyService, useValue: { getAll: () => of({ data: [] }) } },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
      ],
    }).compileComponents();
  });

  it('fica vazia, sem chamar a API, até escolher a empresa', fakeAsync(() => {
    const el = create().nativeElement as HTMLElement;
    expect(service.getByCompany).not.toHaveBeenCalled();
    expect(el.querySelector('.empty')?.textContent).toContain('Selecione uma empresa');
  }));

  it('carrega os funcionários da empresa escolhida', fakeAsync(() => {
    const fixture = create('c1');
    expect(service.getByCompany).toHaveBeenCalledWith('c1');
    expect(fixture.componentInstance.employeeDataSource.data[0]).toEqual(jasmine.objectContaining({ registration: 'ZZT000001', fullName: 'ZZ_TEST_ MARIA' }));
  }));

  it('trata 404 como lista vazia, sem notificar', fakeAsync(() => {
    service.getByCompany.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    const fixture = create('c1');
    expect(fixture.componentInstance.employeeDataSource.data).toEqual([]);
    expect(notification.error).not.toHaveBeenCalled();
  }));

  it('exclui pelo DELETE após confirmação e recarrega', fakeAsync(() => {
    const fixture = create('c1');
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({}));
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(service.delete).toHaveBeenCalledWith('e1');
    expect(service.getByCompany).toHaveBeenCalledTimes(2);
  }));

  it('mostra a mensagem do backend quando a exclusão é recusada (409)', fakeAsync(() => {
    const fixture = create('c1');
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Não é possível desativar: o funcionário possui usuário ativo.' } })));
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(notification.error).toHaveBeenCalledOnceWith('Não é possível desativar: o funcionário possui usuário ativo.');
  }));
});
