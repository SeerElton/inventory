import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

    constructor(private spinnerService: NgxSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.method.toLowerCase() == 'get' || request.url.includes('/baby/growth-record/')) {
            return next.handle(request);
        } else {
            this.spinnerService.show(); // Show the spinner before the request is sent

            return next.handle(request).pipe(
                finalize(() => {
                    this.spinnerService.hide(); // Hide the spinner after the request is completed
                })
            );
        }
    }
}