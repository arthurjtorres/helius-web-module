import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OutsideListComponent } from './outside-list.component';
import { OutsideListModule } from './outside-list.module';

describe('OutsideListComponent', () => {
  let component: OutsideListComponent;
  const items = [{ id: 'v1', key: 'ZZ_TEST_101' }, { id: 'v2', key: 'ZZ_TEST_102' }];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OutsideListModule, NoopAnimationsModule] });
    const fixture = TestBed.createComponent(OutsideListComponent);
    component = fixture.componentInstance;
    component.items = items;
    fixture.detectChanges();
  });

  it('confirma com a quantidade e emite os ids marcados', () => {
    const emitted: string[][] = [];
    component.deactivate.subscribe(ids => emitted.push(ids));
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    component.toggleAll(true);
    component.confirmDeactivate();
    expect(confirmSpy.calls.mostRecent().args[0]).toContain('Desativar 2');
    expect(emitted).toEqual([['v1', 'v2']]);
  });

  it('não emite sem confirmação nem sem seleção', () => {
    const emitted: string[][] = [];
    component.deactivate.subscribe(ids => emitted.push(ids));
    spyOn(window, 'confirm').and.returnValue(false);
    component.confirmDeactivate();
    component.toggle('v1', true);
    component.confirmDeactivate();
    expect(emitted).toEqual([]);
  });

  it('descarta da seleção os itens que saíram da lista', () => {
    component.toggleAll(true);
    component.items = [items[1]];
    component.ngOnChanges();
    expect([...component.selected]).toEqual(['v2']);
    expect(component.allSelected).toBeTrue();
  });
});
