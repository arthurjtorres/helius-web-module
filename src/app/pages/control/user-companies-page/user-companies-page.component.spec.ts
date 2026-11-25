import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { UserCompaniesPageComponent } from './user-companies-page.component';
import { UserCompanyService } from '../../../core/services/user-company.service';
import { CompanyService } from '../../../core/services/company.service';
import CompanyInterface from '../../../core/interfaces/company.interface';
import { NotificationService } from '../../../core/services/notification.service';

describe('UserCompaniesPageComponent', () => {
  let service: jasmine.SpyObj<UserCompanyService>;
  let notification: jasmine.SpyObj<NotificationService>;
  const user = { userId: 'u1', userName: 'zz_test_user', email: 'zz_test_user@example.com' };
  const company = { companyId: 'c1', companyName: 'ZZ_TEST_EMPRESA', companyAcronym: 'ZZ' };

  function render() {
    const fixture = TestBed.createComponent(UserCompaniesPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj<UserCompanyService>('UserCompanyService', ['getCollaborators', 'findByUser', 'grant', 'revoke']);
    service.getCollaborators.and.returnValue(of({ data: [user] }));
    service.findByUser.and.returnValue(of({ data: [{ fkUserId: 'u1', fkCompanyId: 'c1' }] }));
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    const companies = jasmine.createSpyObj<CompanyService>('CompanyService', ['getAll']);
    companies.getAll.and.returnValue(of({ data: [company as unknown as CompanyInterface] }));
    await TestBed.configureTestingModule({
      imports: [UserCompaniesPageComponent, NoopAnimationsModule],
      providers: [
        { provide: UserCompanyService, useValue: service },
        { provide: CompanyService, useValue: companies },
        { provide: NotificationService, useValue: notification },
      ],
    }).compileComponents();
  });

  it('ao escolher o usuário, lista as empresas concedidas pelo nome', () => {
    const fixture = render();
    fixture.componentInstance.selectUser('u1');
    fixture.detectChanges();
    expect(service.findByUser).toHaveBeenCalledWith('u1');
    const cell = (fixture.nativeElement as HTMLElement).querySelector('mat-row mat-cell');
    expect(cell?.textContent?.trim()).toBe('ZZ_TEST_EMPRESA (ZZ)');
  });

  it('concede a empresa e recarrega a lista', () => {
    service.grant.and.returnValue(of({}));
    const page = render().componentInstance;
    page.selectUser('u1');
    page.companyId = 'c2';
    page.grant();
    expect(service.grant).toHaveBeenCalledWith('u1', 'c2');
    expect(service.findByUser).toHaveBeenCalledTimes(2);
  });

  it('mostra a mensagem do control quando a concessão é recusada', () => {
    service.grant.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'A empresa não é do grupo da empresa do funcionário.' } })));
    const page = render().componentInstance;
    page.selectUser('u1');
    page.companyId = 'c2';
    page.grant();
    expect(notification.error).toHaveBeenCalledWith('A empresa não é do grupo da empresa do funcionário.');
  });

  it('retira a empresa após confirmação', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.revoke.and.returnValue(of({}));
    const page = render().componentInstance;
    page.selectUser('u1');
    page.revoke({ fkUserId: 'u1', fkCompanyId: 'c1' });
    expect(service.revoke).toHaveBeenCalledWith('u1', 'c1');
  });

  it('403 não gera aviso extra (o interceptor já avisa)', () => {
    service.getCollaborators.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    render();
    expect(notification.error).not.toHaveBeenCalled();
  });
});
