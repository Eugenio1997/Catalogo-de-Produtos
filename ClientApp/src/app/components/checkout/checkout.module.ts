import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {CheckoutRoutingModule} from "@components/checkout/checkout-routing.module";
import { CartComponent } from "./cart/cart.component";
import { CartService } from './services/cart.service';
import {SharedModule} from "@shared/shared.module";
import {OrderSummaryComponent} from "@components/checkout/order-summary/order-summary.component";


@NgModule({
  declarations: [
    CartComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CheckoutRoutingModule,
    SharedModule
  ],
  exports: [
    CartComponent
  ],
  providers: [
    CartService
  ]
})
export class CheckoutModule { }
