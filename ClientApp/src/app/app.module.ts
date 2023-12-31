import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import {HomeComponent} from "@components/home/home.component";
import {ProductModule} from "@components/product/product.module";
import {SharedModule} from "@shared/shared.module";
import {RegisterProductComponent} from "@components/product/register/register-product.component";
import {ProductListComponent} from "@components/product/list/product-list.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    ProductModule,
    SharedModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: 'register-product', component: RegisterProductComponent},
      {path: 'product-list', component: ProductListComponent},
    ]),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
