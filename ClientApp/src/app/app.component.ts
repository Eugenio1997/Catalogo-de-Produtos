import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SigninService} from "@components/authentication/signin/signin.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit{

  title = 'app';
  sidenavStatus: boolean = false!;
  public isSigninInUse: boolean = false;
  constructor(private _signinService: SigninService,
              private changeDetector: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this._signinService
      .getIsSigninInUse$()
      .subscribe(newState => {
        this.handleIsSigninInUse(newState);
      })
  }

  public handleIsSigninInUse(isSigninInUse: boolean){
    this.isSigninInUse = isSigninInUse;
    this.changeDetector.detectChanges();
  }
}
