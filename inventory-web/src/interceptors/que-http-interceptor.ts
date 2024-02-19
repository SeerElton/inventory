import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, empty } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class QueueHttpInterceptor implements HttpInterceptor {
    private isOnlineSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private isOnline = true;

    constructor() {
        this.checkOnlineStatus();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isOnline) {
            return next.handle(request).pipe(
                catchError(error => {
                    // Handle request error (e.g., logging)
                    console.error('HTTP request failed:', error);
                    return empty(); // Return an empty observable to prevent error propagation
                })
            );
        } else {
            // Queue the request and wait for the online status to change
            return this.isOnlineSubject.pipe(
                filter(isOnline => isOnline === true),
                take(1),
                switchMap(() => {
                    return next.handle(request);
                })
            );
        }
    }

    private checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        this.isOnlineSubject.next(this.isOnline);

        window.addEventListener('online', () => this.handleOnlineStatusChange(true));
        window.addEventListener('offline', () => this.handleOnlineStatusChange(false));
    }

    private handleOnlineStatusChange(isOnline: boolean) {
        this.isOnline = isOnline;
        this.isOnlineSubject.next(isOnline);
    }
}
