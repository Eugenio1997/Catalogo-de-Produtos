import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import {ProductModule} from "@components/product/product.module";
import {SharedModule} from "@shared/shared.module";
import {RegisterProductComponent} from "@components/product/register/register-product.component";
import {ProductListComponent} from "@components/product/list/product-list.component";
import {SigninComponent} from "@components/authentication/signin/signin.component";
import {AuthModule} from "@components/authentication/auth.module";
import {SigninService} from "@components/authentication/signin/signin.service";
import {AuthInterceptor} from "@components/authentication/interceptors/auth.interceptor";
import {SignupComponent} from "@components/authentication/signup/signup.component";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    ProductModule,
    SharedModule,
    AuthModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'product-list', component: ProductListComponent},
      {path: 'register-product', component: RegisterProductComponent},
      {path: 'signin', component: SigninComponent, pathMatch: 'full'},
      {path: 'signup', component: SignupComponent, pathMatch: 'full'},
      {path: '', component: ProductListComponent},
      {path: "**", redirectTo: "product-list" }

    ]),
    ReactiveFormsModule
  ],
  providers: [SigninService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
