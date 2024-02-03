import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductListComponent} from "./list/product-list.component";
import {RegisterProductComponent} from "./register/register-product.component";
import {ProductDetailComponent} from "@components/products/detail/product-detail.component";
import {CartComponent} from "@components/checkout/cart/cart.component";


const productRoutes: Routes = [
  {
    path: 'products/details/:id',
    component: ProductDetailComponent
  },
  {
    path: 'register-product',
    component: RegisterProductComponent
  },
  {
    path: 'products/cart',
    component: CartComponent
  },
  {
    path: 'products',
    component: ProductListComponent,
  },
]


@NgModule({
  imports: [
    RouterModule.forChild(productRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProductRoutingModule { }
