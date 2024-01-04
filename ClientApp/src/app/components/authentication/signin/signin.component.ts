import {
  AfterContentInit, ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, Subject, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {SigninService} from "@components/authentication/signin/signin.service";
import {AuthService} from "@components/authentication/shared/services/auth.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['signin.component.css']
})
export class SigninComponent implements OnInit, AfterContentInit {

  public parentModalContent!: { title: string; body: string; buttonBackground: string; fromComponent?: string };
  public isModalOpen: boolean = false;
  public isSigninInUse: boolean = true;
  public isIsLoggedIn: boolean = true;
  public submitted: boolean = false;
  private notifier = new Subject()

  constructor(private fb: FormBuilder,
              private _authService: AuthService,
              private _signinService: SigninService,
              private _router: Router,
              private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._signinService.updateIsSigninInUse$(this.isSigninInUse)
  }

  ngAfterContentInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.regExpPassword)]],
      rememberMe: [false],
    });
  }

  openModal(httpErrorResponse: HttpErrorResponse){
    this.parentModalContent = {'title': 'Erro', 'body': httpErrorResponse.error, buttonBackground: 'btn-danger btn', fromComponent: 'Signin'}
    this.isModalOpen = true;
    this.changeDetector.detectChanges();
  }

  public regExpPassword: RegExp = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/);
  public authForm: FormGroup = this.fb.group({});

  public signin(): void{
    this.submitted = true;

    if (this.authForm.invalid) {
      return;
    }

    this._authService
      .signin(this.authForm.value)
      .pipe(
        tap((response) => {
            this._signinService.updateIsSigninInUse$(!this.isSigninInUse);
            this._router.navigate(['/'])}),
        takeUntil(this.notifier),
        catchError((httpErrorResponse: HttpErrorResponse): any  => {
          this.openModal(httpErrorResponse);
        })
      )
      .subscribe();


  }

  onReset() {
    this.submitted = false;
    this.authForm.reset();
  }

}
