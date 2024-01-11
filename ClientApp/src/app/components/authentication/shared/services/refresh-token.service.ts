import { Injectable } from '@angular/core';

@Injectable()
export class RefreshTokenService {

  constructor() { }

  public getRefreshToken(): string{
    return localStorage.getItem('refreshToken')!;
  }

  public setRefreshToken(refreshToken:string) {
    localStorage.setItem('refreshToken',refreshToken);
  }

  public removeRefreshToken(): void{
    localStorage.removeItem('refreshToken');
  }
}
