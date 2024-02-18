import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CartComponent} from "@components/checkout/cart/cart.component";
import {OrderSummaryComponent} from "@components/checkout/order-summary/order-summary.component";
import {AuthGuard} from "../../guards/auth/auth.guard";


const checkoutRoutes: Routes = [

  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'order-summary',
    component: OrderSummaryComponent,
    canActivate: [AuthGuard],
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(checkoutRoutes),
  ]
})
export class CheckoutRoutingModule { }
