import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    // Clone request and add Authorization header with Bearer token
    let authReq = req;
    if (token) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If token expired (401 Unauthorized), attempt to refresh the token
        if (error.status === 401 && token) {
          return this.authService.refreshToken().pipe(
            switchMap((newToken: any) => {
              // Retry the original request with the new token
              return next.handle(this.addToken(req, newToken.access));
            }),
            catchError((err) => {
              // Logout if refresh fails
              this.authService.logout();
              return throwError(err);
            })
          );
        }

        return throwError(error);
      })
    );
  }

  // Helper method to add Authorization header
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
