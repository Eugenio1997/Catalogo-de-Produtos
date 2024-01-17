import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {moneyMask} from "@components/products/helpers/format-currency-helper";
import {Product} from "@interfaces/products/product";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  //properties
  @Input() products: Product[] = [];
  public isProductListInUse: boolean = true;

  protected readonly moneyMask = moneyMask;

  constructor(private _router: Router) {}
}
