import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CartComponent} from "./cart/cart.component";
import { CartService } from './services/cart.service';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { OrderSummaryComponent } from './order-summary/order-summary.component';



@NgModule({
  declarations: [
    CartComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CartComponent
  ],
  providers: [
    CartService
  ]
})
export class CheckoutModule { }
