import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

  constructor() { }

  public getToken(): string{
    return localStorage.getItem('accessToken')!;
  }

  public setToken(accessToken:string) {
    localStorage.setItem('accessToken',accessToken);
  }

  public removeToken(): void{
    localStorage.removeItem('accessToken');
  }

}
