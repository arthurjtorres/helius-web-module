import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthInterceptor, FORBIDDEN_FALLBACK_MESSAGE } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';

describe('AuthInterceptor', () => {
  const apiUrl = `${environment.baseUrl}:${environment.operations_port}/vehicle`;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let notification: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    notification = jasmine.createSpyObj<NotificationService>('NotificationService', ['error', 'info']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notification },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('access_token', 'token-de-teste');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('access_token');
  });

  /** Dispara um GET e responde com o status informado; devolve se o erro chegou ao chamador. */
  function failWith(status: number, body: object | null): boolean {
    let propagated = false;
    http.get(apiUrl).subscribe({ error: () => (propagated = true) });
    httpMock.expectOne(apiUrl).flush(body, { status, statusText: 'erro' });
    return propagated;
  }

  it('envia o Bearer em chamada interna', () => {
    http.get(apiUrl).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-teste');
    req.flush({});
  });

  it('não envia o Bearer no login nem em chamada externa', () => {
    const loginUrl = `${environment.baseUrl}:${environment.control_port}/authenticate`;
    http.post(loginUrl, {}).subscribe();
    http.get('https://externo.example.com/x').subscribe();
    expect(httpMock.expectOne(loginUrl).request.headers.has('Authorization')).toBeFalse();
    expect(httpMock.expectOne('https://externo.example.com/x').request.headers.has('Authorization')).toBeFalse();
    httpMock.match(() => true).forEach(r => r.flush({}));
  });

  it('401 desloga e repassa o erro', () => {
    expect(failWith(401, { status: 401, message: 'Token inválido' })).toBeTrue();
    expect(authService.logout).toHaveBeenCalled();
    expect(notification.error).not.toHaveBeenCalled();
  });

  it('403 mostra a mensagem do backend, não desloga e repassa o erro', () => {
    const message = 'Este usuário não possui acesso ao menu: VEICULOS';
    expect(failWith(403, { status: 403, message })).toBeTrue();
    expect(notification.error).toHaveBeenCalledWith(message);
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it('403 sem message no corpo usa o texto padrão', () => {
    failWith(403, null);
    expect(notification.error).toHaveBeenCalledWith(FORBIDDEN_FALLBACK_MESSAGE);
  });

  it('outros erros só são repassados', () => {
    expect(failWith(500, { status: 500, message: 'Erro interno' })).toBeTrue();
    expect(authService.logout).not.toHaveBeenCalled();
    expect(notification.error).not.toHaveBeenCalled();
  });
});
