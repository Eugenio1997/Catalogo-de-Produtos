import {
  AfterContentInit,
  Component,
  ElementRef,
  OnInit, ViewChild
} from '@angular/core';
import {ProductService} from "@components/products/services/product.service";
import {ShoppingCart, ShoppingCartItem} from "@interfaces/products/cart/cart";
import {catchError, map} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Product} from "@interfaces/products/product";
import {moneyMask} from "@components/products/helpers/format-currency-helper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Actions, ErrorName} from "@interfaces/products/detail/product-detail";
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterContentInit{

  public actions: Actions = {add: 'add', rem: 'rem'};
  public errorName: ErrorName = {min: 'min', max: 'max'};
  public productsIds: number[] = [];
  @ViewChild('lineItem') cartItem!: ElementRef<HTMLDivElement>;

  public cart!: ShoppingCart;
  public productsGroup: Product[] = [];
  constructor(private _productService: ProductService,
              private _cartService: CartService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchProductsGroupByIds();
  }


  public fetchProductsGroupByIds(){
    const storedCart: string = this._cartService.retrieveCartFromLocalStorage();
    this.cart = {items: []};
    this.cart.items = JSON.parse(storedCart);

    this.cart = JSON.parse(this._cartService
      .retrieveCartFromLocalStorage());

    this.productsIds = this.cart.items
      .map((item: ShoppingCartItem) => item.itemId);


    this._productService
      .fetchProductsGroupByIds(this.productsIds)
      .pipe(
        map( (response: HttpResponse<Product[]>) => {
          this.productsGroup = this.multiplyPriceByQuantity(response.body as Product[]);
        }),
        catchError( (e: HttpErrorResponse): any => {
          console.log(e.message);
        })
      )
      .subscribe();
  }

  addQuantityToCartForm: FormGroup = this.fb.group({});

  ngAfterContentInit(): void {
    this.initializeFormWithValues();
  }


  public incrementItemLineQuantityToList(itemIndexOnLocalStorage: number): void{

    if (this.addQuantityToCartForm.invalid)
      return;

    this._cartService
        .addItemQuantityToList(
          this.cart,
          this.addQuantityToCartForm,
          this.actions.add,
          this.errorName.max,
          itemIndexOnLocalStorage);

    this.ngOnInit();
  }

  public decrementLineItemQuantityFromList(itemIndexOnLocalStorage: number): void{

    if (this.addQuantityToCartForm.invalid)
      return;


    this._cartService
      .removeItemQuantityFromList(
        this.cart,
        this.addQuantityToCartForm,
        this.actions.rem,
        this.errorName.min,
        itemIndexOnLocalStorage);

    this.ngOnInit();

  }

  private initializeFormWithValues(): void {
    const formValues: any = {};

    this.cart.items.forEach((item, index) => {
      formValues['addToCartOptions_' + index] = [
          item.itemQuantity,
        [Validators.required, Validators.min(1), Validators.max(20)]
      ];
    });

    this.addQuantityToCartForm = this.fb.group(formValues);
  }

  public removeLineItemFromList(itemIdOnLocalStorage: number){

    let updatedCart: ShoppingCartItem[];

    updatedCart = this.cart.items
      .filter((item: ShoppingCartItem) => item.itemId != itemIdOnLocalStorage);

    this.cart.items = updatedCart;

    this._cartService.editCartFromLocalStorage(this.cart);

    this.fetchProductsGroupByIds();

  }

  public multiplyPriceByQuantity(products: Product[]): Product[]{

    products.forEach( (item) => {

        this.cart.items.forEach( (itemFromCart ) => {

          if(item.id == itemFromCart.itemId){
            item.price = item.price * itemFromCart.itemQuantity
          }
        });
    });

    return products;
  }

  public closeOrder() {
      console.log("Fechar pagamento !");
  }


  protected readonly moneyMask = moneyMask;
}
