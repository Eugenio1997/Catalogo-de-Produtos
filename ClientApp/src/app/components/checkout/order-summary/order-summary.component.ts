import {Component, OnInit} from '@angular/core';
import {CartService} from "@components/checkout/services/cart.service";
import {ShoppingCart, ShoppingCartItem} from "@interfaces/products/cart/cart";
import {catchError, map} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Product} from "@interfaces/products/product";
import {ProductService} from "@components/products/services/product.service";

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit{


  public cart!: ShoppingCart;
  public productsGroup: Product[] = [];
  public productsIds: number[] = [];

  constructor(private _cartService: CartService,
              private _productService: ProductService) {}


  ngOnInit(): void {
    this.fetchProductsGroupByIds();
  }


  public fetchProductsGroupByIds(){

    this.cart = {items: []};


    this.cart = JSON.parse(this._cartService
      .retrieveCartFromLocalStorage());

    this.productsIds = this.cart.items
      .map((item: ShoppingCartItem) => item.itemId);


    this._productService
      .fetchProductsGroupByIds(this.productsIds)
      .pipe(
        map( (response: HttpResponse<Product[]>) => {
          this.productsGroup = response.body as Product[];
          console.log(this.productsGroup)
        }),
        catchError( (e: HttpErrorResponse): any => {
          console.log(e.message);
        })
      )
      .subscribe();
  }

  public continueToOrderPayment(){
    console.log('Carregar a tela de Pagamento do Pedido');
  }


}
