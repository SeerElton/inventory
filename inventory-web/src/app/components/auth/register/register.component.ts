import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, LoginRequest, RegisterRequest } from '../../../../swagger-client';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required]], //Validators.pattern('^[a-zA-Z]+(?:\\s[a-zA-Z]+)*$')
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(6), Validators.maxLength(30)]], // Validators.pattern("/^(?=[^A-Z]*[A-Z])(?=\D*\d).{8,}$/")]
      confirmPassword: ['', [Validators.required, Validators.maxLength(6), Validators.maxLength(30)]]
    });
  }

  async register() {
    var body: RegisterRequest = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.authControllerRegister(body).subscribe(x => {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
      this.router.navigate([returnUrl]);
    });
  }

  get passwordFormField() {
    return this.form.get('password');
  }

  get nameFormField() {
    return this.form.get('name');
  }

  get confirmationPasswordFormField() {
    return this.form.get('confirmPassword');
  }
}
