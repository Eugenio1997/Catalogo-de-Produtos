import {AfterContentInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SigninService} from "@components/authentication/signin/signin.service";
import {SignupService} from "@components/authentication/signup/signup.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, Subject, takeUntil, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "@components/authentication/shared/services/auth.service";
import {Router} from "@angular/router";
import {MustMatchValidator} from "@components/authentication/helpers/mustMatchValidator";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, AfterContentInit{


  public isSignupInUse: boolean = true;
  public isSigninInUse: boolean = true;

  public parentModalContent!: { title: string; body: string; buttonBackground: string; fromComponent?: string };
  public isModalOpen: boolean = false;
  public submitted: boolean = false;
  private notifier = new Subject()
  public signupForm: FormGroup = this.fb.group({});
  public regExpPassword: RegExp = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/);

  constructor(private fb: FormBuilder,
              private _authService: AuthService,
              private _signinService: SigninService,
              private _router: Router,
              private changeDetector: ChangeDetectorRef,
              private _signupService: SignupService) {}
  ngOnInit(): void {
    this._signupService.updateIsSignupInUse$(this.isSignupInUse)
  }

  ngAfterContentInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.pattern(this.regExpPassword)]],
      confirmPassword: ['', [Validators.required]],
    },
      {validators: MustMatchValidator('password','confirmPassword')});
  }

  openModal(httpErrorResponse: HttpErrorResponse){
    this.parentModalContent = {'title': 'Erro', 'body': httpErrorResponse.error, buttonBackground: 'btn-danger btn', fromComponent: 'Signup'}
    this.isModalOpen = true;
    this.changeDetector.detectChanges();
  }

  public signup(): void{
    this.submitted = true;

    if (this.signupForm.invalid)
      return;

    this._authService
      .signupEndpointCall(this.signupForm.value)
      .pipe(
        tap((): any => {
          this._signinService.updateIsSigninInUse$(this.isSigninInUse);
          this._signupService.updateIsSignupInUse$(!this.isSignupInUse)
          this._router.navigate(['/signin'])}),
        takeUntil(this.notifier),
        catchError((httpErrorResponse: HttpErrorResponse): any  => {
          this.openModal(httpErrorResponse);
        })
      )
      .subscribe();


  }

  public displaySigninScreen() {
    this._signupService
      .updateIsSignupInUse$(!this.isSignupInUse);

    this._signinService
      .updateIsSigninInUse$(this.isSigninInUse);

    this._router.navigate(['/signin'])

  }

}

