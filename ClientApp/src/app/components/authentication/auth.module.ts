import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import {RouterLink} from "@angular/router";


import {SigninComponent} from "./signin/signin.component";
import {SharedModule} from "@shared/shared.module";
import {SigninService} from "@components/authentication/signin/signin.service";
import {AuthService} from "@components/authentication/shared/services/auth.service";
import {TokenService} from "@components/authentication/shared/services/token.service";
import {RefreshTokenService} from "@components/authentication/shared/services/refresh-token.service";
import { SignupComponent } from './signup/signup.component';
import {SignupService} from "@components/authentication/signup/signup.service";
import {AuthRoutingModule} from "@components/authentication/auth-routing-module";


@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterLink,
    SharedModule,
    AuthRoutingModule
  ],
  exports: [
    SigninComponent,
    SignupComponent
  ],
  providers: [
    AuthService,
    SigninService,
    SignupService,
    TokenService,
    RefreshTokenService
  ]
})
export class AuthModule { }
