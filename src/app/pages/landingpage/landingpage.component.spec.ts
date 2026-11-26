import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { LandingpageComponent } from './landingpage.component';
import { AuthService } from '../../core/services/auth.service';

describe('LandingpageComponent', () => {
  let component: LandingpageComponent;
  let fixture: ComponentFixture<LandingpageComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    await TestBed.configureTestingModule({
    imports: [ReactiveFormsModule, LandingpageComponent],
    providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: jasmine.createSpyObj<Router>('Router', ['navigate']) },
    ],
    schemas: [NO_ERRORS_SCHEMA],
})
    .compileComponents();

    fixture = TestBed.createComponent(LandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Preenche o formulário, faz o login falhar com o status informado e envia. */
  function submitFailing(status: number, body: unknown): void {
    authService.login.and.returnValue(throwError(() => new HttpErrorResponse({ status, error: body })));
    component.loginForm.setValue({ userLogin: 'zz_test_login', password: 'senha-de-teste', savePassword: false });
    fixture.detectChanges();
    component.onSubmit();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login recusado mostra a mensagem genérica', () => {
    submitFailing(401, { status: 401, message: 'Usuário ou senha inválidos' });
    expect(component.errorMessage()).toBe('Falha na autenticação. Verifique seus dados.');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Falha na autenticação. Verifique seus dados.');
  });

  it('429 mostra a mensagem do backend', () => {
    submitFailing(429, { status: 429, message: 'Muitas tentativas. Aguarde.' });
    expect(component.errorMessage()).toBe('Muitas tentativas. Aguarde.');
  });

  it('429 sem message usa o texto padrão', () => {
    submitFailing(429, null);
    expect(component.errorMessage()).toBe('Muitas tentativas. Tente novamente mais tarde.');
  });
});
