import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
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
      error: (err) => {
        this.errorMessage = 'Falha na autenticação. Verifique seus dados.';
      }
    })

    /*if (this.loginForm.valid) {
      console.log('Formulário enviado', this.loginForm.value)
    }*/
  }
}
