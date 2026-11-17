import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { PositionFormComponent, PositionFormData } from './position-form.component';
import { PositionModule } from '../position.module';
import { PositionService } from '../../../core/services/position.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('PositionFormComponent', () => {
  let service: jasmine.SpyObj<PositionService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<PositionFormComponent>>;

  const existing = [
    { positionId: 'p1', positionName: 'ZZ_TEST_MOTORISTA', positionCode: 1 },
    { positionId: 'p2', positionName: 'ZZ_TEST_COBRADOR', positionCode: 2 },
  ];

  function create(data: PositionFormData): PositionFormComponent {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    const fixture = TestBed.createComponent(PositionFormComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<PositionService>('PositionService', ['create', 'update', 'reactivate']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [PositionModule, NoopAnimationsModule],
      providers: [
        { provide: PositionService, useValue: service },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error', 'info']) },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { existing: [] } },
      ],
    }).compileComponents();
  });

  it('bloqueia na tela nome igual a outro cargo ativo (sem acento e sem caixa)', () => {
    const c = create({ existing });
    c.form.setValue({ positionName: ' zz_test_motorista ' });
    expect(c.form.get('positionName')!.hasError('duplicate')).toBeTrue();
    c.onSave();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('na edição aceita o próprio nome e envia só o nome', () => {
    service.update.and.returnValue(of({}));
    const c = create({ position: existing[0], existing });
    c.onSave();
    expect(service.update).toHaveBeenCalledWith('p1', { positionName: 'ZZ_TEST_MOTORISTA' });
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('409 sem id marca o campo', () => {
    service.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'x' } })));
    const c = create({ existing });
    c.form.setValue({ positionName: 'ZZ_TEST_FISCAL' });
    c.onSave();
    expect(c.form.get('positionName')!.hasError('duplicate')).toBeTrue();
  });

  it('409 com id de inativo oferece reativar e reativa se confirmado', () => {
    service.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { data: { id: 'p9' } } })));
    service.reactivate.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    const c = create({ existing });
    c.form.setValue({ positionName: 'ZZ_TEST_FISCAL' });
    c.onSave();
    expect(service.reactivate).toHaveBeenCalledWith('p9');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
