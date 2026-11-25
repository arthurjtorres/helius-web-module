import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Tempo, em milissegundos, que a notificação fica visível. */
const DURATION_MS = 5000;
const CLOSE_LABEL = 'Fechar';

/**
 * Notificações curtas para o usuário (snackbar do Angular Material).
 *
 * Centraliza o aviso de erros que não pertencem a uma tela específica (ex.: 403 no interceptor)
 * e substitui `alert()` nas telas, à medida que forem revisadas.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);


  /**
   * Mostra uma mensagem de erro.
   * @param message texto exibido ao usuário (sem dados pessoais).
   */
  error(message: string): void {
    this.open(message, 'notification-error');
  }

  /**
   * Mostra uma mensagem informativa.
   * @param message texto exibido ao usuário.
   */
  info(message: string): void {
    this.open(message, 'notification-info');
  }

  private open(message: string, panelClass: string): void {
    this.snackBar.open(message, CLOSE_LABEL, { duration: DURATION_MS, panelClass });
  }
}
