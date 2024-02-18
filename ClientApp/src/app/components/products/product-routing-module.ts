import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProductListComponent} from "./list/product-list.component";
import {RegisterProductComponent} from "./register/register-product.component";
import {ProductDetailComponent} from "@components/products/detail/product-detail.component";


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
    path: 'products/checkout',
    loadChildren: () => import('../products/../checkout/checkout.module').then(c => c.CheckoutModule),
  },
  {
    path: '',
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
