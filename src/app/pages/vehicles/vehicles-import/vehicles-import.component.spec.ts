import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehiclesImportComponent, SheetState } from './vehicles-import.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleService } from '../../../core/services/vehicle.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleRow, VehicleSheet } from './vehicle-sheet';
import { ImportReport } from '../../../shared/import-report/import-report.model';

describe('VehiclesImportComponent', () => {
  let component: VehiclesImportComponent;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VehiclesImportComponent>>;

  const row = (over: Partial<VehicleRow> = {}): VehicleRow => ({
    line: 4, vehicleNumber: 'ZZ_TEST_101', brand: 'M', model: 'O-500', licensePlate: 'AAA0A00', chassisNumber: 'CHASSI000001',
    fabricationYear: '2020', modelYear: '2021', renavan: '00123456789', typeVehicleName: 'ZZ_TEST_TIPO', capacity: 44,
    hasWifi: null, cameraType: null, ...over,
  });
  const sheet = (over: Partial<VehicleSheet> = {}): VehicleSheet => ({ name: 'A', rows: [row()], companyName: 'zz_test empresa', ...over });
  const report = (over: Partial<ImportReport> = {}): ImportReport => ({
    dryRun: true, mode: 'upsert', created: [{ line: 4, vehicleNumber: 'ZZ_TEST_101', vehicleId: 'n1' }], updated: [], unchanged: [],
    skipped: [], failed: [], missingVehicleTypes: [], ...over,
  });

  /** Aba pronta para simular (empresa e padrões escolhidos). */
  function ready(s = sheet()): SheetState {
    component.companyId = 'c1';
    component.load([s]);
    const state = component.state!;
    state.hasWifi = false;
    state.cameraType = 'TACOM';
    return state;
  }

  beforeEach(async () => {
    vehicleService = jasmine.createSpyObj<VehicleService>('VehicleService', ['bulkImport', 'getVehiclesByCompany']);
    vehicleService.getVehiclesByCompany.and.returnValue(of({ data: [{ vehicleNumber: 'ZZ_TEST_101' }, { vehicleNumber: 'ZZ_TEST_999' }] }));
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const companyService = jasmine.createSpyObj<CompanyService>('CompanyService', ['getAll']);
    companyService.getAll.and.returnValue(of({ data: [{ companyId: 'c1', companyName: 'ZZ_TEST EMPRESA', companyAcronym: 'ZT' } as never] }));
    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleService },
        { provide: CompanyService, useValue: companyService },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error', 'info']) },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(VehiclesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('recusa arquivo com mais de uma aba', () => {
    component.companyId = 'c1';
    component.load([sheet(), sheet({ name: 'B' })]);
    expect(component.state).toBeUndefined();
    expect(TestBed.inject(NotificationService).error).toHaveBeenCalledWith('O arquivo deve ter uma única aba.');
  });

  it('usa a empresa do combobox e bloqueia se a coluna EMPRESA indicar outra (sem acento nem caixa)', () => {
    expect(component.blocker(ready())).toBeNull();
    expect(component.blocker(ready(sheet({ companyName: 'Outra empresa' })))).toContain('EMPRESA');
  });

  it('trocar a empresa depois de carregar vale para a aba e invalida a simulação', () => {
    vehicleService.bulkImport.and.returnValue(of({ data: report() }));
    const state = ready();
    component.simulate(state);
    component.companyId = 'c2';
    component.companyChanged();
    expect(state.companyId).toBe('c2');
    expect(component.canImport(state)).toBeFalse();
  });

  it('bloqueia simulação sem padrões, com capacidade inválida ou acima de 500 linhas', () => {
    component.companyId = 'c1';
    component.load([sheet()]);
    expect(component.blocker(component.state!)).toContain('Wi-Fi');
    expect(component.blocker(ready(sheet({ rows: [row({ capacity: null })] })))).toContain('capacidade');
    expect(component.blocker(ready(sheet({ rows: Array.from({ length: 501 }, (_, i) => row({ line: i })) })))).toContain('500');
    expect(component.blocker(ready())).toBeNull();
  });

  it('linha com Wi-Fi e câmera próprios dispensa o padrão', () => {
    component.companyId = 'c1';
    component.load([sheet({ rows: [row({ hasWifi: true, cameraType: 'ENGIS' })] })]);
    expect(component.blocker(component.state!)).toBeNull();
  });

  it('simula com os padrões aplicados, sem a linha, e calcula os fora da planilha', () => {
    vehicleService.bulkImport.and.returnValue(of({ data: report() }));
    const state = ready();
    component.simulate(state);
    const [companyId, vehicles, dryRun] = vehicleService.bulkImport.calls.mostRecent().args;
    expect(companyId).toBe('c1');
    expect(dryRun).toBeTrue();
    expect(vehicles[0]).toEqual(jasmine.objectContaining({ hasWifi: false, cameraType: 'TACOM', capacity: 44 }));
    expect('line' in vehicles[0]).toBeFalse();
    expect(state.outside).toEqual(['ZZ_TEST_999']);
    expect(component.canImport(state)).toBeTrue();
  });

  it('400 com relatório mostra as falhas e não libera a importação', () => {
    vehicleService.bulkImport.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 400, error: { data: report({ failed: [{ line: 4, field: 'renavan', error: 'Renavam inválido.' }] }) },
    })));
    const state = ready();
    component.simulate(state);
    expect(state.report?.failed.length).toBe(1);
    expect(component.canImport(state)).toBeFalse();
  });

  it('importa com os ids confirmados e fecha devolvendo true', () => {
    vehicleService.bulkImport.and.returnValue(of({ data: report() }));
    const state = ready();
    component.simulate(state);
    state.confirmIds = ['v3'];
    vehicleService.bulkImport.and.returnValue(of({ data: report({ dryRun: false }) }));
    component.import(state);
    expect(vehicleService.bulkImport.calls.mostRecent().args.slice(2)).toEqual([false, ['v3']]);
    expect(state.imported).toBeTrue();
    component.close();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('editar depois de simular exige nova simulação', () => {
    vehicleService.bulkImport.and.returnValue(of({ data: report() }));
    const state = ready();
    component.simulate(state);
    component.changed(state);
    expect(component.canImport(state)).toBeFalse();
  });
});
