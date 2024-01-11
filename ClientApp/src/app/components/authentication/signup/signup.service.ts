import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class SignupService {

  private isSignupInUse$ = new BehaviorSubject<boolean>(false);
  constructor() { }

  getIsSignupInUse$(): Observable<boolean> {
    return this.isSignupInUse$.asObservable();
  }

  updateIsSignupInUse$(newState: boolean): void {
    this.isSignupInUse$.next(newState);
  }
}
