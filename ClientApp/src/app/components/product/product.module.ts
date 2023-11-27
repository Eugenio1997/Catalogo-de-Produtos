import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ProductListComponent } from "@components/product/list/product-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterProductComponent} from "@components/product/register/register-product.component";

import { ProductCardComponent } from '@components/product/product-card/product-card.component';
import {SharedModule} from "@shared/shared.module";
import {ProductService} from "./product.service";
import {CheckProductTypePipe} from "@components/product/helpers/pipes/check-product-type.pipe";

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCardComponent,
    RegisterProductComponent,
    CheckProductTypePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    SharedModule,
    FormsModule
  ],
  exports: [
    ProductListComponent,
  ],
  providers: [
    ProductService
  ],
})
export class ProductModule { }
