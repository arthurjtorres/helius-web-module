import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { PositionPageComponent } from './position-page.component';
import { PositionModule } from '../position.module';
import { PositionService } from '../../../core/services/position.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

describe('PositionPageComponent', () => {
  let service: jasmine.SpyObj<PositionService>;
  let notification: jasmine.SpyObj<NotificationService>;
  const position = { positionId: 'p1', positionName: 'ZZ_TEST_MOTORISTA', positionCode: 7 };

  function render(list: ReturnType<PositionService['getAll']>) {
    service.getAll.and.returnValue(list);
    const fixture = TestBed.createComponent(PositionPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<PositionService>('PositionService', ['getAll', 'delete', 'reactivate']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [PositionModule, NoopAnimationsModule],
      providers: [
        { provide: PositionService, useValue: service },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: AuthService, useValue: { canSeeInactive: () => true } },
      ],
    }).compileComponents();
  });

  it('lista código e nome', () => {
    const el: HTMLElement = render(of({ data: [position] })).nativeElement;
    const cells = Array.from(el.querySelectorAll('mat-row mat-cell')).map(c => c.textContent?.trim());
    expect(cells.slice(0, 2)).toEqual(['7', 'ZZ_TEST_MOTORISTA']);
  });

  it('trata 404 como lista vazia, sem notificar', () => {
    const fixture = render(throwError(() => new HttpErrorResponse({ status: 404 })));
    expect(fixture.componentInstance.dataSource.data).toEqual([]);
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('mostra o 409 de cargo com funcionários ativos ao excluir', () => {
    const fixture = render(of({ data: [position] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Não é possível desativar: o cargo possui funcionários ativos.' } })));
    fixture.componentInstance.deletePosition(position);
    expect(notification.error).toHaveBeenCalledWith('Não é possível desativar: o cargo possui funcionários ativos.');
  });

  it('exclui após confirmação e recarrega', () => {
    const fixture = render(of({ data: [position] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({}));
    fixture.componentInstance.deletePosition(position);
    expect(service.delete).toHaveBeenCalledWith('p1');
    expect(service.getAll).toHaveBeenCalledTimes(2);
  });

  it('mostra a coluna de status e "Reativar" só no inativo (T17)', () => {
    const el: HTMLElement = render(of({ data: [{ ...position, activated: true }, { ...position, activated: false }] })).nativeElement;
    expect(Array.from(el.querySelectorAll('mat-cell.status')).map(c => c.textContent?.trim())).toEqual(['Ativo', 'Inativo']);
    expect(el.querySelectorAll('button[aria-label="Reativar"]').length).toBe(1);
  });

  it('desmarcar "Ocultar inativos" recarrega com includeInactive (T17)', () => {
    const fixture = render(of({ data: [position] }));
    fixture.componentInstance.includeInactive = true;
    fixture.componentInstance.loadData();
    expect(service.getAll).toHaveBeenCalledWith(true);
  });

  it('reativa após confirmação e recarrega (T17)', () => {
    const fixture = render(of({ data: [position] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.reactivate.and.returnValue(of({}));
    fixture.componentInstance.reactivatePosition(position);
    expect(service.reactivate).toHaveBeenCalled();
    expect(service.getAll).toHaveBeenCalledTimes(2);
  });
});
