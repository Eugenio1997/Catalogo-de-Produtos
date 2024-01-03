import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class SigninService {

  private isSigninInUse$ = new BehaviorSubject<boolean>(false);

  constructor() { }


  getIsSigninInUse$(): Observable<boolean> {
    return this.isSigninInUse$.asObservable();
  }

  updateIsSigninInUse(newState: boolean): void {
    this.isSigninInUse$.next(newState);
  }
}
