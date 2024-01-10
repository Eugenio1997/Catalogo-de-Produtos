import {Component, OnInit} from '@angular/core';


import {SignupService} from "@components/authentication/signup/signup.service";
import {SigninService} from "@components/authentication/signin/signin.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit{

  title = 'app';
  sidenavStatus: boolean = false!;
  public isSigninInUse: boolean = false;
  public isSignupInUse: boolean = false;

  constructor(private _signupService: SignupService,
  private _signinService: SigninService) {
  }
  ngOnInit(): void {
    this._signinService
      .getIsSigninInUse$()
      .subscribe(newState => {
        Promise.resolve()
          .then(() => this.isSigninInUse = newState)
      });

    this._signupService
      .getIsSignupInUse$()
      .subscribe(newState => {
        Promise.resolve()
          .then(() => this.isSignupInUse = newState)
      });
  }

}
