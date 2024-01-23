import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



import {SharedModule} from "@shared/shared.module";
import {ProductListComponent} from "@components/products/list/product-list.component";
import {ProductCardComponent} from "@components/products/subcomponents/product-card/product-card.component";
import {RegisterProductComponent} from "@components/products/register/register-product.component";
import {CheckProductTypePipe} from "@components/products/subcomponents/product-card/pipes/check-product-type.pipe";
import {ProductRoutingModule} from "@components/products/product-routing-module";
import {ProductDetailComponent} from "@components/products/detail/product-detail.component";
import { CartComponent } from './cart/cart.component';
import {ProductService} from "@components/products/services/product.service";
import {CartService} from "@components/products/services/cart.service";


@NgModule({
  declarations: [
    ProductListComponent,
    ProductCardComponent,
    RegisterProductComponent,
    ProductDetailComponent,
    CheckProductTypePipe,
    CartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    SharedModule,
    FormsModule,
    ProductRoutingModule
  ],
  exports: [
    ProductListComponent,
    ProductCardComponent,
    RegisterProductComponent,
    CheckProductTypePipe,
    ProductDetailComponent,
    CartComponent
  ],
  providers: [
    ProductService,
    CartService
  ],
})
export class ProductModule { }
