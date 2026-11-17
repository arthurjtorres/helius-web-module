import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehiclePageComponent } from './vehicle-page.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleService } from '../../../core/services/vehicle.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';

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

  function render(response: ReturnType<VehicleService['getAllVehicles']>): HTMLElement {
    vehicleService.getAllVehicles.and.returnValue(response);
    fixture = TestBed.createComponent(VehiclePageComponent);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  const cells = (el: HTMLElement, column: string) =>
    Array.from(el.querySelectorAll(`mat-cell.${column}`)).map(c => c.textContent?.trim());

  beforeEach(async () => {
    vehicleService = jasmine.createSpyObj<VehicleService>('VehicleService', ['getAllVehicles']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleService },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
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
});
