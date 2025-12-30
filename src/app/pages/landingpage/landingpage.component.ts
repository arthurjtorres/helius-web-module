import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      userLogin: ['', Validators.required],
      password: ['', Validators.required],
      savePassword: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulário enviado', this.loginForm.value)
    }
  }
}
