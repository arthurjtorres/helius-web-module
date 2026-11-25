import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

const LOGIN_FAILED_MESSAGE = 'Falha na autenticação. Verifique seus dados.';
const TOO_MANY_ATTEMPTS_MESSAGE = 'Muitas tentativas. Tente novamente mais tarde.';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: string = '';

  constructor(

    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ){
    this.loginForm = this.fb.group({
      userLogin: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      savePassword: [false]
    });
    
    
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { userLogin, password } = this.loginForm.value;
    
    this.authService.login(userLogin, password).subscribe({
      next: (response) => {
      // Verificamos se o token foi realmente salvo antes de mudar de página
      if (localStorage.getItem('access_token')) {
        this.router.navigate(['/home']); // Ou a rota principal do seu app
      }
    },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = this.loginErrorMessage(err);
      }
    })
  }

  /**
   * Mensagem do erro de login. O 429 vem do rate limit do `control` (3 falhas em 15 min por IP + login).
   * @param err erro devolvido pelo `POST /authenticate`.
   */
  private loginErrorMessage(err: HttpErrorResponse): string {
    if (err.status !== 429) return LOGIN_FAILED_MESSAGE;
    const message = (err.error as { message?: unknown } | null)?.message;
    return typeof message === 'string' && message.trim() ? message : TOO_MANY_ATTEMPTS_MESSAGE;
  }
}
