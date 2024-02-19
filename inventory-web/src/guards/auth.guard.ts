import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginResponse } from '../swagger-client';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../services/session.service';



@Injectable()
export class AuthGuardService implements CanActivate {

    session: LoginResponse | null = null;

    constructor(private sessionService: SessionService, public router: Router, private toastrService: ToastrService) {
        this.sessionService.authToken$.subscribe(session => {
            this.session = session;
        })
    }

    canActivate(): boolean {
        if (!this.session?.jwt) {
            this.router.navigate(['auth/login']);
            return false;
        }

        return true;
    }
}