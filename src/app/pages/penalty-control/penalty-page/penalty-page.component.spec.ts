import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PenaltyPageComponent } from './penalty-page.component';
import { PenaltyControlModule } from '../penalty-control.module';
import { PenaltyService } from '../../../core/services/penalty.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { PenaltyCompositeView } from '../../../core/interfaces/penalty.interface';

describe('PenaltyPageComponent', () => {
  let service: jasmine.SpyObj<PenaltyService>;
  const row: PenaltyCompositeView = { docId: 'd1', docRegistration: 'ZZ1', activated: false, penaltyInfoId: 'p1', penaltyActivated: true } as PenaltyCompositeView;

  function render(rows: PenaltyCompositeView[]) {
    service.getCompositePenalties.and.returnValue(of({ status: 200, message: 'ok', data: rows }) as never);
    const fixture = TestBed.createComponent(PenaltyPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<PenaltyService>('PenaltyService', ['getCompositePenalties', 'reactivatePenaltyInfo', 'reactivatePenaltyDoc']);
    service.reactivatePenaltyInfo.and.returnValue(of({}));
    service.reactivatePenaltyDoc.and.returnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [PenaltyControlModule, NoopAnimationsModule],
      providers: [
        { provide: PenaltyService, useValue: service },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error', 'info']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: AuthService, useValue: { canSeeInactive: () => true } },
      ],
    }).compileComponents();
  });

  it('mostra a situação e "Reativar" só no documento inativo (T17)', () => {
    const el: HTMLElement = render([{ ...row, docId: 'd0', activated: true }, row]).nativeElement;
    expect(Array.from(el.querySelectorAll('mat-cell.status')).map(c => c.textContent?.trim())).toEqual(['Ativo', 'Inativo']);
    expect(el.querySelectorAll('button[aria-label="Reativar"]').length).toBe(1);
  });

  it('com a penalidade ativa, reativa só o documento (T17)', () => {
    const fixture = render([row]);
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.componentInstance.reactivatePenalty(row);
    expect(service.reactivatePenaltyInfo).not.toHaveBeenCalled();
    expect(service.reactivatePenaltyDoc).toHaveBeenCalledWith('d1');
  });

  it('com a penalidade inativa, reativa ela antes do documento (T17)', () => {
    const fixture = render([row]);
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.componentInstance.reactivatePenalty({ ...row, penaltyActivated: false });
    expect(service.reactivatePenaltyInfo).toHaveBeenCalledWith('p1');
    expect(service.reactivatePenaltyDoc).toHaveBeenCalledWith('d1');
    expect(service.getCompositePenalties).toHaveBeenCalledTimes(2);
  });
});
