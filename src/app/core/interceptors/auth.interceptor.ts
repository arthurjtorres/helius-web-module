import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Mensagem usada quando o 403 não traz `message` no padrão `{ status, message }`. */
export const FORBIDDEN_FALLBACK_MESSAGE = 'Você não tem permissão para esta ação.';

/**
 * Anexa o token às chamadas das APIs do Helius e trata os erros de autenticação e autorização:
 * - 401: token ausente, inválido ou expirado → desloga;
 * - 403: usuário sem o módulo, menu ou ação (`checkPermission` nos backends) → avisa e mantém a sessão.
 * Em ambos o erro é repassado, para a tela encerrar o carregamento.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private notification: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access_token');
    const apiBaseUrl = environment.baseUrl;

    const isInternalRequest = request.url.startsWith(apiBaseUrl);
    const isLoginRequest = request.url.includes('/authenticate');

    if (token && isInternalRequest && !isLoginRequest) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
        } else if (error.status === 403) {
          this.notification.error(this.messageFrom(error) ?? FORBIDDEN_FALLBACK_MESSAGE);
        }
        return throwError(() => error);
      })
    );
  }

  /** Lê a `message` do corpo de erro padrão dos backends, se existir. */
  private messageFrom(error: HttpErrorResponse): string | null {
    const message = (error.error as { message?: unknown } | null)?.message;
    return typeof message === 'string' && message.trim() ? message : null;
  }
}
