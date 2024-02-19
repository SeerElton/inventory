import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../swagger-client';
import { SessionService } from '../services/session.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    session: LoginResponse | null = null;

    constructor(private sessionService: SessionService) {
        this.sessionService.authToken$.subscribe(session => {
            this.session = session;
        })
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });

        if (this.session?.jwt) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.session.jwt}`
                }
            });
        }

        return next.handle(request);
    }
}
