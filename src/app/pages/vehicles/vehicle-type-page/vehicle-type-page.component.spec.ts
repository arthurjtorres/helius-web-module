import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { VehicleTypePageComponent } from './vehicle-type-page.component';
import { VehiclesModule } from '../vehicles.module';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('VehicleTypePageComponent', () => {
  let service: jasmine.SpyObj<VehicleTypeService>;
  let notification: jasmine.SpyObj<NotificationService>;
  const type = { typeVehicleId: 't1', typeVehicleName: 'ZZ_TEST_CONVENCIONAL AR', airConditioner: true };

  function render(list: ReturnType<VehicleTypeService['list']>) {
    service.list.and.returnValue(list);
    const fixture = TestBed.createComponent(VehicleTypePageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<VehicleTypeService>('VehicleTypeService', ['list', 'delete']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [VehiclesModule, NoopAnimationsModule],
      providers: [
        { provide: VehicleTypeService, useValue: service },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
      ],
    }).compileComponents();
  });

  it('lista nome e ar-condicionado', () => {
    const el: HTMLElement = render(of({ data: [type] })).nativeElement;
    const cells = Array.from(el.querySelectorAll('mat-row mat-cell')).map(c => c.textContent?.trim());
    expect(cells.slice(0, 2)).toEqual(['ZZ_TEST_CONVENCIONAL AR', 'Sim']);
  });

  it('trata 404 como lista vazia, sem notificar', () => {
    const fixture = render(throwError(() => new HttpErrorResponse({ status: 404 })));
    expect(fixture.componentInstance.dataSource.data).toEqual([]);
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('mostra o 409 de tipo com veículos ativos ao excluir', () => {
    const fixture = render(of({ data: [type] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Não é possível desativar: o tipo de veículo possui veículos ativos.' } })));
    fixture.componentInstance.deleteType(type);
    expect(notification.error).toHaveBeenCalledWith('Não é possível desativar: o tipo de veículo possui veículos ativos.');
  });

  it('exclui após confirmação e recarrega', () => {
    const fixture = render(of({ data: [type] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({}));
    fixture.componentInstance.deleteType(type);
    expect(service.delete).toHaveBeenCalledWith('t1');
    expect(service.list).toHaveBeenCalledTimes(2);
  });
});
