import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";

import {AppComponent } from './app.component';
import {SharedModule} from "@shared/shared.module";
import {AuthModule} from "@components/authentication/auth.module";
import {SigninService} from "@components/authentication/signin/signin.service";
import {AuthInterceptor} from "@components/authentication/interceptors/auth.interceptor";
import {AppRoutingModule} from "./app-routing.module";
import {RouterOutlet} from "@angular/router";
import {ProductModule} from "@components/products/product.module";
import {CheckoutModule} from "@components/checkout/checkout.module";


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
    AppRoutingModule,
    ReactiveFormsModule,
    RouterOutlet,
    CheckoutModule,
    JwtModule.forRoot({
        config: {
          tokenGetter:  () => localStorage.getItem("accessToken"),
          allowedDomains: ["https://localhost:44411"]
        }
      }
    )
  ],
  providers: [SigninService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
