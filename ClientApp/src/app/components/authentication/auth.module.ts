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


@NgModule({
  declarations: [
    SigninComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterLink,
    SharedModule
  ],
  exports: [
    SigninComponent
  ],
  providers: [AuthService, SigninService, TokenService, RefreshTokenService]
})
export class AuthModule { }
