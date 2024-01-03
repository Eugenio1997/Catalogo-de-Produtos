import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {ProductModule} from "@components/product/product.module";
import {SharedModule} from "@shared/shared.module";
import {RegisterProductComponent} from "@components/product/register/register-product.component";
import {ProductListComponent} from "@components/product/list/product-list.component";
import {SigninComponent} from "@components/authentication/signin/signin.component";
import {AuthModule} from "@components/authentication/auth.module";



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
      {path: '', redirectTo: 'product-list', pathMatch: 'full'},
      {path: 'product-list', component: ProductListComponent, pathMatch: 'full'},
      {path: 'register-product', component: RegisterProductComponent},
      {path: 'signin', component: SigninComponent, pathMatch: 'full'},
    ]),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
