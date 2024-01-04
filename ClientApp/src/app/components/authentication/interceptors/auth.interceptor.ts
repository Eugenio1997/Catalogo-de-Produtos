import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TokenService} from "../shared/services/token.service";

@Injectable({providedIn:"root"})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _tokenService: TokenService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted!', request);
    const token: string = this._tokenService.getToken();
    if (token) {
      const copiedReq = request.clone({
        headers: request.headers.set(
          'authorization', 'Bearer ' + token
        )
      });
      return next.handle(copiedReq);
    }
    return next.handle(request);


  }
}
