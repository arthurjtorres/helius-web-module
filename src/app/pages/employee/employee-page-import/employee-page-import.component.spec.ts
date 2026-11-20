import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { EmployeePageImportComponent, decodeText } from './employee-page-import.component';
import { EmployeeModule } from '../employee.module';
import { EmployeeService } from '../../../core/services/employee.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmployeeRow } from './employee-sheet';
import { ImportReport } from '../../../shared/import-report/import-report.model';

describe('EmployeePageImportComponent', () => {
  let component: EmployeePageImportComponent;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EmployeePageImportComponent>>;

  const row = (over: Partial<EmployeeRow> = {}): EmployeeRow => ({
    line: 3, registration: '001234', fullName: 'ZZ_TEST_ MARIA DA SILVA', admissionDate: '01/02/2020',
    position: 'MOTORISTA', birthDate: '15/06/1985', cpf: '', ...over,
  });
  const report = (over: Partial<ImportReport> = {}): ImportReport => ({
    dryRun: true, mode: 'upsert', created: [{ line: 1, registration: 'ZT001234', employeeId: 'n1' }], updated: [], unchanged: [],
    skipped: [], failed: [], missingPositions: [], ...over,
  });

  /** Arquivo e empresa escolhidos: pronto para simular. */
  function ready(rows = [row()]): void {
    component.load({ rows });
    component.companyId = 'c1';
  }

  beforeEach(async () => {
    employeeService = jasmine.createSpyObj<EmployeeService>('EmployeeService', ['bulkImport', 'getByCompany', 'bulkDeactivate']);
    employeeService.getByCompany.and.returnValue(of({ data: [] }));
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const companyService = jasmine.createSpyObj<CompanyService>('CompanyService', ['getAll']);
    companyService.getAll.and.returnValue(of({ data: [{ companyId: 'c1', companyName: 'ZZ_TEST EMPRESA', companyAcronym: 'ZT' } as never] }));
    await TestBed.configureTestingModule({
      imports: [EmployeeModule, NoopAnimationsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeService },
        { provide: CompanyService, useValue: companyService },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error', 'info']) },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(EmployeePageImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bloqueia simulação sem arquivo, com erro de leitura, sem empresa ou acima de 5000 linhas', () => {
    expect(component.blocker()).toContain('arquivo');
    component.load({ rows: [], error: 'Colunas não encontradas: CPF.' });
    expect(component.blocker()).toBe('Colunas não encontradas: CPF.');
    component.load({ rows: [row()] });
    expect(component.blocker()).toContain('empresa');
    ready(Array.from({ length: 5001 }, (_, i) => row({ line: i + 3 })));
    expect(component.blocker()).toContain('5000');
    ready();
    expect(component.blocker()).toBeNull();
  });

  it('simula numa requisição só, sem a linha, e mostra o relatório com a linha do arquivo', () => {
    employeeService.bulkImport.and.returnValue(of({ data: report() }));
    ready([row(), row({ line: 7, registration: '001235' })]);
    component.simulate();
    const [companyId, employees, dryRun, confirmIds] = employeeService.bulkImport.calls.mostRecent().args;
    expect(companyId).toBe('c1');
    expect(dryRun).toBeTrue();
    expect(confirmIds).toEqual([]);
    expect(employees.length).toBe(2);
    expect('line' in employees[0]).toBeFalse();
    expect(component.report?.created[0].line).toBe(3);
    expect(component.canImport()).toBeTrue();
  });

  it('cargos ausentes ou 400 com relatório não liberam a importação', () => {
    employeeService.bulkImport.and.returnValue(of({ data: report({ missingPositions: ['ZZ_TEST_CARGO'] }) }));
    ready();
    component.simulate();
    expect(component.canImport()).toBeFalse();

    employeeService.bulkImport.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 400, error: { data: report({ failed: [{ line: 1, field: 'birthDate', error: 'Data inválida.' }] }) },
    })));
    component.simulate();
    expect(component.report?.failed[0].line).toBe(3);
    expect(component.canImport()).toBeFalse();
  });

  it('importa com os ids confirmados e fecha devolvendo true', () => {
    employeeService.bulkImport.and.returnValue(of({ data: report() }));
    ready();
    component.simulate();
    component.confirmIds = ['e9'];
    employeeService.bulkImport.and.returnValue(of({ data: report({ dryRun: false }) }));
    component.import();
    expect(employeeService.bulkImport.calls.mostRecent().args.slice(2)).toEqual([false, ['e9']]);
    expect(component.imported).toBeTrue();
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('trocar a empresa depois de simular exige nova simulação', () => {
    employeeService.bulkImport.and.returnValue(of({ data: report() }));
    ready();
    component.simulate();
    component.changed();
    expect(component.canImport()).toBeFalse();
  });

  it('.txt em Windows-1252 é lido com acentos', () => {
    const bytes = new Uint8Array([0x46, 0x55, 0x4e, 0xc7, 0xc3, 0x4f]); // "FUNÇÃO" em Windows-1252
    expect(decodeText(bytes.buffer)).toBe('FUNÇÃO');
    expect(decodeText(new TextEncoder().encode('FUNÇÃO').buffer as ArrayBuffer)).toBe('FUNÇÃO');
  });

  describe('lista "fora da planilha" (T19)', () => {
    const notification = () => TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    const active = { data: [{ employeeId: 'n1', registration: 'ZT001234' }, { employeeId: 'e9', registration: 'ZT009999' }] };

    function importNow(): void {
      employeeService.getByCompany.and.returnValue(of(active));
      employeeService.bulkImport.and.returnValue(of({ data: report({ dryRun: false }) }));
      ready();
      component.import();
    }

    it('lista os ativos da empresa cuja matrícula não veio no relatório', () => {
      importNow();
      expect(employeeService.getByCompany).toHaveBeenCalledWith('c1');
      expect(component.outsideItems).toEqual([{ id: 'e9', key: 'ZT009999' }]);
    });

    it('desliga os marcados com a data de rescisão do campo e tira da lista', () => {
      importNow();
      component.terminationDate = '2026-11-19';
      employeeService.bulkDeactivate.and.returnValue(of({ message: '1 funcionário(s) desligado(s).', data: { deactivated: 1, pendingEmployeeIds: [] } }));
      component.deactivate(['e9']);
      expect(employeeService.bulkDeactivate).toHaveBeenCalledWith(['e9'], '2026-11-19');
      expect(component.outsideItems).toEqual([]);
      expect(notification().info).toHaveBeenCalledWith('1 funcionário(s) desligado(s).');
    });

    it('control fora: avisa como erro que os usuários seguem ativos', () => {
      importNow();
      employeeService.bulkDeactivate.and.returnValue(of({ message: 'Desligados, mas os usuários não.', data: { deactivated: 1, pendingEmployeeIds: ['e9'] } }));
      component.deactivate(['e9']);
      expect(notification().error).toHaveBeenCalledWith('Desligados, mas os usuários não.');
    });

    it('409: mostra a mensagem e recarrega a lista', () => {
      importNow();
      employeeService.getByCompany.calls.reset();
      employeeService.bulkDeactivate.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Nada foi desligado.' } })));
      component.deactivate(['e9']);
      expect(notification().error).toHaveBeenCalledWith('Nada foi desligado.');
      expect(employeeService.getByCompany).toHaveBeenCalledWith('c1');
    });

    it('a data de rescisão começa em hoje e vai no máximo até amanhã', () => {
      const now = new Date();
      const day = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      expect(component.terminationDate).toBe(day(now));
      expect(component.maxTerminationDate).toBe(day(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)));
    });
  });
});
