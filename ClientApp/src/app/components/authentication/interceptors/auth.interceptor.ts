import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {AuthService} from "@components/authentication/shared/services/auth.service";
import {RequestRefreshToken} from "@interfaces/authentication/refresh-token/request-refresh-token";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _authService: AuthService,
  private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.getToken();
    return next.handle(this.addToken(request, token)).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.handle401Error(request, next);
          }
          return throwError(error);
        })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this._authService.getToken();
    const refreshToken = this._authService.getRefreshToken();

    const credentials: RequestRefreshToken = {
      Token: token,
      RefreshToken: refreshToken
    }

    return this._authService.refreshTokenEndpointCall(credentials).pipe(
        switchMap((httpResponse: HttpResponse<any>) => {
            const newToken: string = httpResponse.body!.token;
            const newRefreshToken: string = httpResponse.body.refreshToken!;
            this._authService.removeToken();
            this._authService.removeRefreshToken();
            this._authService.setToken(newToken);
            this._authService.setRefreshToken(newRefreshToken);
            const updatedRequest = this.addToken(request, newToken);
            return next.handle(updatedRequest);
        }),
        catchError((error) => {
            this._router.navigate(['/signin'])
            return throwError(error);
        })
    );
  }
}
