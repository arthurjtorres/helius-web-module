import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService.canSeeInactive (T17)', () => {
  /** Token com o payload dado (só o payload é lido no front). */
  const tokenWith = (payload: object) => `x.${btoa(JSON.stringify(payload))}.y`;

  function serviceFor(payload: object): AuthService {
    localStorage.setItem('access_token', tokenWith(payload));
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    return TestBed.inject(AuthService);
  }

  afterEach(() => localStorage.removeItem('access_token'));

  it('só leitura no menu: não vê', () => {
    expect(serviceFor({ clearance: 'USUARIO', roles: [], allowedMenus: [{ menu: 'VEICULOS', permissions: ['READ'] }] }).canSeeInactive('VEICULOS')).toBeFalse();
  });

  it('UPDATE no menu: vê; em outro menu, não', () => {
    const service = serviceFor({ clearance: 'USUARIO', roles: [], allowedMenus: [{ menu: 'VEICULOS', permissions: ['READ', 'UPDATE'] }] });
    expect(service.canSeeInactive('VEICULOS')).toBeTrue();
    expect(service.canSeeInactive('FUNCIONARIOS')).toBeFalse();
  });

  it('acesso total (SUPER_ADMIN ou DESENVOLVEDOR): vê; sem token: não', () => {
    expect(serviceFor({ clearance: 'SUPER_ADMIN', roles: [], allowedMenus: [] }).canSeeInactive('VEICULOS')).toBeTrue();
    TestBed.resetTestingModule();
    expect(serviceFor({ clearance: 'ADMIN', roles: [{ role: 'DESENVOLVEDOR' }], allowedMenus: [] }).canSeeInactive('VEICULOS')).toBeTrue();
    TestBed.resetTestingModule();
    localStorage.removeItem('access_token');
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    expect(TestBed.inject(AuthService).canSeeInactive('VEICULOS')).toBeFalse();
  });
});
