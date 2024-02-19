import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ToastrResponse } from '../swagger-client';

@Injectable()
export class ToastrInterceptor implements HttpInterceptor {
    constructor(private toastrService: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event: any) => {
                if (event.body && event.body.message && event.body.type) {
                    const { message, type } = event.body;
                    if (type == ToastrResponse.TypeEnum.Warning) {
                        this.toastrService.warning(message)
                    } else if (type == ToastrResponse.TypeEnum.Success) {
                        this.toastrService.success(message)
                    }
                }
            }, (error: HttpErrorResponse) => {
                console.log('e')
                if (error.error && error.error.message && error.error.type) {
                    const { message, type } = error.error;
                    if (type == ToastrResponse.TypeEnum.Error) {
                        this.toastrService.error(message)
                    }
                }
            })
        );
    }
}
