import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehicleTypeFormComponent, VehicleTypeFormData } from './vehicle-type-form.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { NotificationService } from '../../../core/services/notification.service';
import { normalizeText } from '../../../core/utils/normalize-text';

describe('VehicleTypeFormComponent', () => {
  let service: jasmine.SpyObj<VehicleTypeService>;
  let notification: jasmine.SpyObj<NotificationService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<VehicleTypeFormComponent>>;

  const existing = [
    { typeVehicleId: 't1', typeVehicleName: 'ZZ_TEST_CONVENCIONAL', airConditioner: false },
    { typeVehicleId: 't2', typeVehicleName: 'ZZ_TEST_MICRO', airConditioner: true },
  ];

  function create(data: VehicleTypeFormData): VehicleTypeFormComponent {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    const fixture = TestBed.createComponent(VehicleTypeFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<VehicleTypeService>('VehicleTypeService', ['create', 'update', 'reactivate']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleTypeService, useValue: service },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { existing: [] } },
      ],
    }).compileComponents();
  });

  it('normalizeText ignora acento, caixa e espaços', () => {
    expect(normalizeText('  zz_test  Ônibus ')).toBe('ZZ_TEST ONIBUS');
  });

  it('bloqueia na tela nome igual a outro tipo ativo, sem chamar a API', () => {
    const c = create({ existing });
    c.form.setValue({ typeVehicleName: ' zz_test_convencional ', airConditioner: false });
    expect(c.form.get('typeVehicleName')!.hasError('duplicate')).toBeTrue();
    c.onSave();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('na edição aceita o próprio nome', () => {
    const c = create({ type: existing[0], existing });
    expect(c.form.valid).toBeTrue();
  });

  it('cria com o nome aparado e fecha o diálogo', () => {
    service.create.and.returnValue(of({}));
    const c = create({ existing });
    c.form.setValue({ typeVehicleName: ' ZZ_TEST_ARTICULADO ', airConditioner: true });
    c.onSave();
    expect(service.create).toHaveBeenCalledWith({ typeVehicleName: 'ZZ_TEST_ARTICULADO', airConditioner: true });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('409 sem id (ativo criado por outra origem) marca o campo', () => {
    service.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'x' } })));
    const c = create({ existing });
    c.form.setValue({ typeVehicleName: 'ZZ_TEST_VAN', airConditioner: false });
    c.onSave();
    expect(c.form.get('typeVehicleName')!.hasError('duplicate')).toBeTrue();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('409 com id de inativo oferece reativar e reativa se confirmado', () => {
    service.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { data: { id: 't9' } } })));
    service.reactivate.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    const c = create({ existing });
    c.form.setValue({ typeVehicleName: 'ZZ_TEST_VAN', airConditioner: false });
    c.onSave();
    expect(service.reactivate).toHaveBeenCalledWith('t9');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('409 com id de inativo não reativa sem confirmação', () => {
    service.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { data: { id: 't9' } } })));
    spyOn(window, 'confirm').and.returnValue(false);
    const c = create({ existing });
    c.form.setValue({ typeVehicleName: 'ZZ_TEST_VAN', airConditioner: false });
    c.onSave();
    expect(service.reactivate).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
