import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('token');
    req = req.clone({
      setHeaders: {
        'Accept-Language': 'ru',
      },
    });
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `JWT ${accessToken}`,
        },
      });
    }
    return next.handle(req).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}
