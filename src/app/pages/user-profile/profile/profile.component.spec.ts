import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserProfileModule } from '../user-profile.module';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(withXhr()), provideHttpClientTesting(),
        { provide: AuthService, useValue: { getUser: () => of({ userId: 'u1', userName: 'ZZ_TEST_ Usuário', clearance: 'SUPERVISOR' }) } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // bug: lia `fkClearanceId`, que não existe no token, e mostrava "Acesso Total (Sistema)" para todos
  it('mostra o nível de acesso do token', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Nível de acesso: SUPERVISOR');
    expect(text).not.toContain('Acesso Total (Sistema)');
  });
});
