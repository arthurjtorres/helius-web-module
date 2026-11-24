import { TestBed } from '@angular/core/testing';
import { InactiveToggleComponent } from './inactive-toggle.component';
import { InactiveToggleModule } from './inactive-toggle.module';
import { AuthService } from '../../core/services/auth.service';

describe('InactiveToggleComponent (T17)', () => {
  function create(canSee: boolean) {
    TestBed.configureTestingModule({
      imports: [InactiveToggleModule],
      providers: [{ provide: AuthService, useValue: { canSeeInactive: () => canSee } }],
    });
    const fixture = TestBed.createComponent(InactiveToggleComponent);
    fixture.componentInstance.menu = 'FUNCIONARIOS';
    fixture.detectChanges();
    return fixture;
  }

  it('some para quem não pode ver inativos', () => {
    expect((create(false).nativeElement as HTMLElement).querySelector('mat-checkbox')).toBeNull();
  });

  it('aparece marcado e emite true ao desmarcar', () => {
    const fixture = create(true);
    const emitted: boolean[] = [];
    fixture.componentInstance.includeInactiveChange.subscribe(v => emitted.push(v));
    const input = (fixture.nativeElement as HTMLElement).querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBeTrue();
    input.click();
    expect(emitted).toEqual([true]);
  });
});
