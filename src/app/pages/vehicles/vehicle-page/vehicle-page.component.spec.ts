import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehiclePageComponent } from './vehicle-page.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleService } from '../../../core/services/vehicle.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';
import { AuthService } from '../../../core/services/auth.service';

describe('VehiclePageComponent', () => {
  let fixture: ComponentFixture<VehiclePageComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let notification: jasmine.SpyObj<NotificationService>;

  const vehicle: VehicleInterface = {
    vehicleId: 'v1',
    vehicleNumber: 'ZZ_TEST_101',
    brand: 'Marca',
    licensePlate: 'AAA0A00',
    renavan: '00123456789',
    model: 'Modelo',
    VehicleType: { typeVehicleName: 'ZZ_TEST_CONVENCIONAL', airConditioner: false },
    company: { companyName: 'ZZ_TEST_EMPRESA' },
  };

  /** Renderiza com a empresa `c1` escolhida (a tabela só carrega com empresa). */
  function render(response: ReturnType<VehicleService['getVehiclesByCompany']>): HTMLElement {
    vehicleService.getVehiclesByCompany.and.returnValue(response);
    fixture = TestBed.createComponent(VehiclePageComponent);
    fixture.componentInstance.companyId = 'c1';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const cells = (el: HTMLElement, column: string) =>
    Array.from(el.querySelectorAll(`mat-cell.${column}`)).map(c => c.textContent?.trim());

  beforeEach(async () => {
    vehicleService = jasmine.createSpyObj<VehicleService>('VehicleService', ['getVehiclesByCompany', 'deleteVehicle', 'reactivateVehicle']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleService },
        { provide: NotificationService, useValue: notification },
        { provide: CompanyService, useValue: { getAll: () => of({ data: [] }) } },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: AuthService, useValue: { canSeeInactive: () => true } },
      ],
    }).compileComponents();
  });

  it('mostra empresa, tipo e campos do veículo como a API devolve', fakeAsync(() => {
    const el = render(of({ data: [vehicle] }));
    expect(cells(el, 'company')).toEqual(['ZZ_TEST_EMPRESA']);
    expect(cells(el, 'type')).toEqual(['ZZ_TEST_CONVENCIONAL']);
    expect(cells(el, 'vehicleNumber')).toEqual(['ZZ_TEST_101']);
    expect(cells(el, 'licensePlate')).toEqual(['AAA0A00']);
  }));

  it('mostra texto neutro quando empresa ou tipo não vierem', fakeAsync(() => {
    const el = render(of({ data: [{ ...vehicle, company: null, VehicleType: undefined }] }));
    expect(cells(el, 'company')).toEqual(['—']);
    expect(cells(el, 'type')).toEqual(['—']);
  }));

  it('trata 404 como lista vazia, sem notificar', fakeAsync(() => {
    const el = render(throwError(() => new HttpErrorResponse({ status: 404 })));
    expect(el.querySelectorAll('mat-row').length).toBe(0);
    expect(notification.error).not.toHaveBeenCalled();
  }));

  it('não notifica de novo o 403 (o interceptor já avisa)', fakeAsync(() => {
    render(throwError(() => new HttpErrorResponse({ status: 403 })));
    expect(notification.error).not.toHaveBeenCalled();
  }));

  it('notifica os demais erros', fakeAsync(() => {
    render(throwError(() => new HttpErrorResponse({ status: 500 })));
    expect(notification.error).toHaveBeenCalledOnceWith('Não foi possível carregar os veículos.');
  }));

  it('exclui após confirmação e recarrega a lista', fakeAsync(() => {
    render(of({ data: [vehicle] }));
    spyOn(window, 'confirm').and.returnValue(true);
    vehicleService.deleteVehicle.and.returnValue(of({}));
    fixture.componentInstance.deleteVehicle(vehicle);
    tick();
    expect(vehicleService.deleteVehicle).toHaveBeenCalledWith('v1');
    expect(vehicleService.getVehiclesByCompany).toHaveBeenCalledTimes(2);
  }));

  it('fica vazia, sem chamar a API, até escolher a empresa', fakeAsync(() => {
    fixture = TestBed.createComponent(VehiclePageComponent);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(vehicleService.getVehiclesByCompany).not.toHaveBeenCalled();
    expect((fixture.nativeElement as HTMLElement).querySelector('.empty')?.textContent).toContain('Selecione uma empresa');
  }));

  it('carrega os veículos da empresa escolhida', fakeAsync(() => {
    render(of({ data: [vehicle] }));
    expect(vehicleService.getVehiclesByCompany).toHaveBeenCalledWith('c1', false);
  }));

  it('não exclui sem confirmação', fakeAsync(() => {
    render(of({ data: [vehicle] }));
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.componentInstance.deleteVehicle(vehicle);
    expect(vehicleService.deleteVehicle).not.toHaveBeenCalled();
  }));

  it('mostra a coluna de status e "Reativar" só no inativo (T17)', fakeAsync(() => {
    const el = render(of({ data: [{ ...vehicle, activated: true }, { ...vehicle, vehicleId: 'v2', activated: false }] }));
    expect(cells(el, 'status')).toEqual(['Ativo', 'Inativo']);
    expect(el.querySelectorAll('button[aria-label="Reativar"]').length).toBe(1);
  }));

  it('desmarcar "Ocultar inativos" recarrega com includeInactive (T17)', fakeAsync(() => {
    render(of({ data: [vehicle] }));
    fixture.componentInstance.includeInactive = true;
    fixture.componentInstance.loadData();
    expect(vehicleService.getVehiclesByCompany).toHaveBeenCalledWith('c1', true);
  }));

  it('reativa após confirmação e mostra a mensagem do 409 (T17)', fakeAsync(() => {
    render(of({ data: [vehicle] }));
    spyOn(window, 'confirm').and.returnValue(true);
    vehicleService.reactivateVehicle.and.returnValue(of({}));
    fixture.componentInstance.reactivateVehicle(vehicle);
    expect(vehicleService.reactivateVehicle).toHaveBeenCalledWith('v1');
    expect(vehicleService.getVehiclesByCompany).toHaveBeenCalledTimes(2);
    vehicleService.reactivateVehicle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Tipo de veículo inativo.' } })));
    fixture.componentInstance.reactivateVehicle(vehicle);
    expect(notification.error).toHaveBeenCalledWith('Tipo de veículo inativo.');
  }));
});
