import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CompanySelectComponent } from './company-select.component';
import { CompanyService } from '../../core/services/company.service';
import { NotificationService } from '../../core/services/notification.service';

describe('CompanySelectComponent', () => {
  function create(companies: object[], value = '') {
    const companyService = jasmine.createSpyObj<CompanyService>('CompanyService', ['getAll']);
    companyService.getAll.and.returnValue(of({ data: companies as never }));
    TestBed.configureTestingModule({
      imports: [CompanySelectComponent, NoopAnimationsModule],
      providers: [
        { provide: CompanyService, useValue: companyService },
        { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['error']) },
      ],
    });
    const fixture = TestBed.createComponent(CompanySelectComponent);
    const component = fixture.componentInstance;
    const changes: string[] = [];
    component.registerOnChange(v => changes.push(v));
    component.writeValue(value);
    fixture.detectChanges();
    return { component, changes };
  }

  it('pré-seleciona e avisa quando há uma única empresa', () => {
    const { component, changes } = create([{ companyId: 'c1', companyName: 'ZZ_TEST_ A', companyAcronym: 'ZA' }]);
    expect(component.value).toBe('c1');
    expect(changes).toEqual(['c1']);
  });

  it('não pré-seleciona com várias empresas nem sobrescreve valor recebido', () => {
    const two = [{ companyId: 'c1', companyName: 'A', companyAcronym: 'A' }, { companyId: 'c2', companyName: 'B', companyAcronym: 'B' }];
    expect(create(two).changes).toEqual([]);
    TestBed.resetTestingModule();
    const { component, changes } = create([two[0]], 'c9');
    expect(component.value).toBe('c9');
    expect(changes).toEqual([]);
  });

  it('seleção propaga o valor', () => {
    const { component, changes } = create([]);
    component.select('c2');
    expect(changes).toEqual(['c2']);
  });
});
