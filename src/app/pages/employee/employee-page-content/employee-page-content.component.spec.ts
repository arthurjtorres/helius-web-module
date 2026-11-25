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
import { AuthService } from '../../../core/services/auth.service';

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
    service = jasmine.createSpyObj<EmployeeService>('EmployeeService', ['getByCompany', 'delete', 'reactivate']);
    service.getByCompany.and.returnValue(of({ data: [apiEmployee] }) as never);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [
        { provide: EmployeeService, useValue: service },
        { provide: CompanyService, useValue: { getAll: () => of({ data: [] }) } },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: AuthService, useValue: { canSeeInactive: () => true } },
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
    expect(service.getByCompany).toHaveBeenCalledWith('c1', false);
    expect(fixture.componentInstance.employeeDataSource.data[0]).toEqual(jasmine.objectContaining({ registration: 'ZZT000001', fullName: 'ZZ_TEST_ MARIA' }));
  }));

  it('trata 404 como lista vazia, sem notificar', fakeAsync(() => {
    service.getByCompany.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    const fixture = create('c1');
    expect(fixture.componentInstance.employeeDataSource.data).toEqual([]);
    expect(notification.error).not.toHaveBeenCalled();
  }));

  /** Simula o diálogo de rescisão devolvendo `date` (undefined = cancelou). */
  const closeDialogWith = (date?: string) =>
    (TestBed.inject(MatDialog).open as jasmine.Spy).and.returnValue({ afterClosed: () => of(date) });

  it('desliga com a data escolhida no diálogo e recarrega', fakeAsync(() => {
    const fixture = create('c1');
    closeDialogWith('2026-11-19');
    service.delete.and.returnValue(of({ message: 'ok', data: { deactivatedUsers: [], pendingEmployeeIds: [] } }));
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(service.delete).toHaveBeenCalledWith('e1', '2026-11-19');
    expect(notification.info).toHaveBeenCalled();
    expect(service.getByCompany).toHaveBeenCalledTimes(2);
  }));

  it('cancelar o diálogo não chama a API', fakeAsync(() => {
    const fixture = create('c1');
    closeDialogWith(undefined);
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(service.delete).not.toHaveBeenCalled();
  }));

  it('avisa quando o usuário ficou pendente (control fora)', fakeAsync(() => {
    const fixture = create('c1');
    closeDialogWith('2026-11-19');
    const message = 'Funcionário desligado, mas o usuário dele não foi desativado.';
    service.delete.and.returnValue(of({ message, data: { deactivatedUsers: [], pendingEmployeeIds: ['e1'] } }));
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(notification.error).toHaveBeenCalledOnceWith(message);
    expect(service.getByCompany).toHaveBeenCalledTimes(2);
  }));

  it('mostra a mensagem do backend quando o desligamento é recusado', fakeAsync(() => {
    const fixture = create('c1');
    closeDialogWith('2019-01-01');
    service.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'A data de rescisão não pode ser anterior à admissão.' } })));
    fixture.componentInstance.deleteEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(notification.error).toHaveBeenCalledOnceWith('A data de rescisão não pode ser anterior à admissão.');
  }));

  it('mostra a coluna de status e "Reativar" só no inativo (T17)', fakeAsync(() => {
    service.getByCompany.and.returnValue(of({ data: [{ ...apiEmployee, activated: true }, { ...apiEmployee, employeeId: 'e2', activated: false }] }) as never);
    const el = create('c1').nativeElement as HTMLElement;
    const status = Array.from(el.querySelectorAll('mat-cell.status')).map(c => c.textContent?.trim());
    expect(status).toEqual(['Ativo', 'Inativo']);
    expect(el.querySelectorAll('button[aria-label="Reativar"]').length).toBe(1);
  }));

  it('reativa após confirmação e recarrega (T17)', fakeAsync(() => {
    const fixture = create('c1');
    spyOn(window, 'confirm').and.returnValue(true);
    service.reactivate.and.returnValue(of({}));
    fixture.componentInstance.reactivateEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(service.reactivate).toHaveBeenCalledWith('e1');
    expect(service.getByCompany).toHaveBeenCalledTimes(2);
  }));

  it('não reativa sem confirmação (T17)', fakeAsync(() => {
    const fixture = create('c1');
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.componentInstance.reactivateEmployee({ employeeId: 'e1', registration: 'ZZT000001' } as never);
    expect(service.reactivate).not.toHaveBeenCalled();
  }));
});
