import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehiclesFormComponent, yearValidator } from './vehicles-form.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleService } from '../../../core/services/vehicle.service';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { CompanyService } from '../../../core/services/company.service';
import { NotificationService } from '../../../core/services/notification.service';
import { VehicleInterface } from '../../../core/interfaces/vehicle.interface';
import { FormControl } from '@angular/forms';

describe('VehiclesFormComponent', () => {
  let component: VehiclesFormComponent;
  let fixture: ComponentFixture<VehiclesFormComponent>;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let vehicleTypeService: jasmine.SpyObj<VehicleTypeService>;
  let notification: jasmine.SpyObj<NotificationService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VehiclesFormComponent>>;

  const valid = {
    vehicleNumber: 'ZZ_TEST_101',
    fkVehicleCompanyId: 'c1',
    fkTypeVehicleId: 't1',
    brand: 'Marca',
    model: 'Modelo',
    licensePlate: 'aaa0a00',
    chassisNumber: 'abc12345',
    renavan: '00123456789',
    fabricationYear: '2020',
    modelYear: '2021',
    capacity: '40',
    hasWifi: true,
    cameraType: 'TACOM',
  };

  function create(data: VehicleInterface | null, typesResponse = of({ data: [{ typeVehicleId: 't1', typeVehicleName: 'ZZ_TEST_TIPO', airConditioner: false }] })) {
    vehicleTypeService.list.and.returnValue(typesResponse);
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    fixture = TestBed.createComponent(VehiclesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    vehicleService = jasmine.createSpyObj<VehicleService>('VehicleService', ['createVehicle', 'updateVehicle']);
    vehicleTypeService = jasmine.createSpyObj<VehicleTypeService>('VehicleTypeService', ['list']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    const companyService = jasmine.createSpyObj<CompanyService>('CompanyService', ['getAll']);
    companyService.getAll.and.returnValue(of({ data: [{ companyId: 'c1', companyName: 'ZZ_TEST_EMPRESA' } as never] }));

    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleService, useValue: vehicleService },
        { provide: VehicleTypeService, useValue: vehicleTypeService },
        { provide: CompanyService, useValue: companyService },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();
  });

  it('carrega empresas e tipos para os selects', () => {
    create(null);
    expect(component.companies().length).toBe(1);
    expect(component.vehicleTypes().length).toBe(1);
  });

  it('trata 404 dos tipos como lista vazia, sem notificar', () => {
    create(null, throwError(() => new HttpErrorResponse({ status: 404 })));
    expect(component.vehicleTypes()).toEqual([]);
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('cria com placa e chassi em maiúsculas, anos em texto e capacidade numérica', () => {
    create(null);
    vehicleService.createVehicle.and.returnValue(of({}));
    component.form.setValue(valid);
    component.onSave();
    const payload = vehicleService.createVehicle.calls.mostRecent().args[0];
    expect(payload.licensePlate).toBe('AAA0A00');
    expect(payload.chassisNumber).toBe('ABC12345');
    expect(payload.capacity).toBe(40);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('edita pelo id do veículo recebido', () => {
    create({ vehicleId: 'v1', ...valid, capacity: 40 } as VehicleInterface);
    vehicleService.updateVehicle.and.returnValue(of({}));
    expect(component.isEdit).toBeTrue();
    component.onSave();
    expect(vehicleService.updateVehicle).toHaveBeenCalledWith('v1', jasmine.objectContaining({ vehicleNumber: 'ZZ_TEST_101' }));
  });

  it('rejeita placa, Renavam, ano e capacidade fora do formato do /bulk', () => {
    create(null);
    component.form.setValue({ ...valid, licensePlate: 'AB1234', renavan: '123', fabricationYear: '1949', capacity: '301' });
    expect(component.form.get('licensePlate')!.invalid).toBeTrue();
    expect(component.form.get('renavan')!.invalid).toBeTrue();
    expect(component.form.get('fabricationYear')!.invalid).toBeTrue();
    expect(component.form.get('capacity')!.invalid).toBeTrue();
    component.onSave();
    expect(vehicleService.createVehicle).not.toHaveBeenCalled();
  });

  it('mostra o 409 de placa no campo da placa, sem notificação', () => {
    create(null);
    vehicleService.createVehicle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Placa já cadastrado(a).' } })));
    component.form.setValue(valid);
    component.onSave();
    expect(component.form.get('licensePlate')!.getError('conflict')).toBe('Placa já cadastrado(a).');
    expect(notification.error).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('yearValidator aceita até o ano seguinte', () => {
    const next = String(new Date().getFullYear() + 1);
    expect(yearValidator(new FormControl(next))).toBeNull();
    expect(yearValidator(new FormControl(String(Number(next) + 1)))).toEqual({ year: true });
  });
});
