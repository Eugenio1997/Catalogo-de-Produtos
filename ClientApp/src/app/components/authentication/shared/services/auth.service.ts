import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";
import {ResponseSignin} from "@interfaces/authentication/response-signin";
import {TokenService} from "@components/authentication/shared/services/token.service";
import {RefreshTokenService} from "@components/authentication/shared/services/refresh-token.service";
import {SigninService} from "@components/authentication/signin/signin.service";

@Injectable()
export class AuthService {

  constructor(private _http: HttpClient,
              @Inject('BACKEND_BASE_URL') private backendBaseUrl: string,
              private router: Router,
              private _tokenService: TokenService,
              private _refreshToken: RefreshTokenService) {}

  public signin(formData: FormGroup): Observable<HttpResponse<ResponseSignin>> {
    return this._http
      .post<any>(this.backendBaseUrl + 'auth/' + 'signin', formData, {observe: 'response'})
      .pipe(
        tap(response => {
          if(response.status == 200){
            const accessToken = response.body!.accessToken;
            const refreshToken = response.body!.refreshToken;
            this._tokenService.setToken(accessToken);
            this._refreshToken.setRefreshToken(refreshToken);
          }
        })
      )
  }

}
