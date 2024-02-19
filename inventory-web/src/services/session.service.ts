import { Injectable } from '@angular/core';
import { AuthService, LoginRequest, LoginResponse } from '../swagger-client';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  authToken: LoginResponse | null = null;
  authToken$ = new BehaviorSubject<LoginResponse | null>(null);
  private readonly _authKey = 'token';

  getToken(): string | undefined {
    return this.authToken?.jwt;
  }

  isAuthenticated() {
    return !(!this.authToken?.jwt);
  }

  constructor(httpClient: HttpClient, private authService: AuthService) {
    const token = localStorage.getItem(this._authKey);

    if (token) {
      this.authToken = JSON.parse(token) as LoginResponse;
      this.authToken$?.next(this.authToken);
    }
  }

  login(body: LoginRequest) {
    return this.authService.authControllerLogin(body).pipe(
      tap((response: any) => {
        localStorage.setItem(this._authKey, JSON.stringify(response));
        this.authToken = response;
        this.authToken$?.next(response);
      })
    );
  }
}
