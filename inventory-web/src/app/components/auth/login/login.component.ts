import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../../swagger-client';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private sessionService: SessionService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,30}$")
      ]]
    });
  }

  ngOnInit(): void {
    const isLoggedIn = this.sessionService.authToken;
    if (isLoggedIn)
      this.router.navigate(['/'])
  }

  async login() {
    var body: LoginRequest = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.sessionService.login(body).subscribe(x => {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
      this.router.navigate([returnUrl]);
    });
  }
}
