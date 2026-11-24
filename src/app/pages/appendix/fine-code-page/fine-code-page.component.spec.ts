import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

import { FineCodePageComponent } from './fine-code-page.component';
import { AppendixModule } from '../appendix.module';
import { FineCodeService } from '../../../core/services/fine-code.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

describe('FineCodePageComponent', () => {
  let service: jasmine.SpyObj<FineCodeService>;
  let notification: jasmine.SpyObj<NotificationService>;
  const code = { fineCodeId: 'f1', fineNumber: '101', fineDescription: 'ZZ_TEST_ multa', fineKm: '1' };

  function render(list: unknown) {
    service.getAll.and.returnValue(list as never);
    const fixture = TestBed.createComponent(FineCodePageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<FineCodeService>('FineCodeService', ['getAll', 'delete', 'reactivate']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    await TestBed.configureTestingModule({
      imports: [AppendixModule, NoopAnimationsModule],
      providers: [
        { provide: FineCodeService, useValue: service },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: AuthService, useValue: { canSeeInactive: () => true } },
      ],
    }).compileComponents();
  });

  it('mostra a coluna de status e "Reativar" só no inativo (T17)', () => {
    const el: HTMLElement = render(of({ data: [{ ...code, activated: true }, { ...code, fineCodeId: 'f2', activated: false }] })).nativeElement;
    expect(Array.from(el.querySelectorAll('mat-cell.status')).map(c => c.textContent?.trim())).toEqual(['Ativo', 'Inativo']);
    expect(el.querySelectorAll('button[aria-label="Reativar"]').length).toBe(1);
  });

  it('desmarcar "Ocultar inativos" recarrega com includeInactive (T17)', () => {
    const fixture = render(of({ data: [code] }));
    fixture.componentInstance.includeInactive = true;
    fixture.componentInstance.loadData();
    expect(service.getAll).toHaveBeenCalledWith(true);
  });

  it('exclui pelo DELETE (antes um PUT recusado) e mostra o 409 da API', () => {
    const fixture = render(of({ data: [code] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(of({}));
    fixture.componentInstance.deleteFineCode(code);
    expect(service.delete).toHaveBeenCalledWith('f1');
    expect(service.getAll).toHaveBeenCalledTimes(2);
    service.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409, error: { message: 'Código com penalidades ativas.' } })));
    fixture.componentInstance.deleteFineCode(code);
    expect(notification.error).toHaveBeenCalledWith('Código com penalidades ativas.');
  });

  it('reativa após confirmação e recarrega (T17)', () => {
    const fixture = render(of({ data: [code] }));
    spyOn(window, 'confirm').and.returnValue(true);
    service.reactivate.and.returnValue(of({}));
    fixture.componentInstance.reactivateFineCode(code);
    expect(service.reactivate).toHaveBeenCalledWith('f1');
    expect(service.getAll).toHaveBeenCalledTimes(2);
  });
});
