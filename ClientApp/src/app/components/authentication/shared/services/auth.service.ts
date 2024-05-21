import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {Observable, of, tap} from "rxjs";
import {TokenService} from "@components/authentication/shared/services/token.service";
import {RefreshTokenService} from "@components/authentication/shared/services/refresh-token.service";
import {RequestRefreshToken} from "@interfaces/authentication/refresh-token/request-refresh-token";
import {ResponseSignin} from "@interfaces/authentication/signin/response-signin";
import {JwtHelperService} from "@auth0/angular-jwt";


@Injectable()
export class AuthService {

  public _jwtHelper: JwtHelperService;
  constructor(private _http: HttpClient,
              @Inject('BACKEND_BASE_URL') private backendBaseUrl: string,
              private _tokenService: TokenService,
              private _refreshToken: RefreshTokenService) {

    this._jwtHelper = new JwtHelperService()

  }

  public getToken(): string {
    return this._tokenService.getToken()!;
  }

  public setToken(accessToken: string) {
    this._tokenService.setToken(accessToken);
  }

  public removeToken(): void {
    this._tokenService.removeToken();
  }

  public getRefreshToken(): string {
    return this._refreshToken.getRefreshToken()!;
  }

  public setRefreshToken(accessToken: string) {
    this._refreshToken.setRefreshToken(accessToken);
  }

  public removeRefreshToken(): void {
    this._refreshToken.removeRefreshToken();
  }

  public signinEndpointCall(formData: FormGroup): Observable<HttpResponse<ResponseSignin>> {

    return this._http
      .post<any>(this.backendBaseUrl + 'auth/' + 'signin', formData, {observe: 'response'})
      .pipe(
        tap(response => {
          if (response.status == 200) {
            const accessToken = response.body!.accessToken;
            const refreshToken = response.body!.refreshToken;
            this._tokenService.setToken(accessToken);
            this._refreshToken.setRefreshToken(refreshToken);
            this.setLoggedInUsername(response.body!.userName);
          }
        })
      )
  }

  public signupEndpointCall(signupFormData: FormGroup): Observable<HttpResponse<ResponseSignin>> {
    return this._http
      .post<any>(this.backendBaseUrl + 'auth/' + 'signup', signupFormData, {observe: 'response'})
  }

  public refreshTokenEndpointCall(credentials: RequestRefreshToken): any {
    const body = credentials;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this._http
      .post<any>(this.backendBaseUrl + 'auth/' + 'refresh',
        body,
        {observe: 'response', headers})

  }

  public isAuthenticated(): Observable<boolean> {

    const token = this.getToken();

    if(!this._jwtHelper.isTokenExpired(token)){
      return of(true);
    }
    return of(false);

  }

  public setLoggedInUsername(username: string): void{
    localStorage.setItem("loggedInUsername", username);
  }

  public getLoggedInUsername(): string {
    return localStorage.getItem("loggedInUsername") as string;
  }

}
