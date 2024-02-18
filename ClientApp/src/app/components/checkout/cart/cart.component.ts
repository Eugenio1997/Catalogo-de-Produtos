import {
  AfterContentInit, ChangeDetectorRef,
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
import {Modal} from "@interfaces/modal";
import {Router} from "@angular/router";
import {AuthService} from "@components/authentication/shared/services/auth.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, AfterContentInit{

  public isModalOpen: boolean = false;
  public item: {itemName: string, itemId: number} = {itemName: '', itemId: 0}
  public childModalContent: Modal = {'title': 'Erro', 'body': '', buttonBackgroundColor: 'btn', fromComponent: 'Cart'};
  public isClickedDeleteButton!: boolean;
  public actions: Actions = {add: 'add', rem: 'rem'};
  public errorName: ErrorName = {min: 'min', max: 'max'};
  public productsIds: number[] = [];
  @ViewChild('lineItem') cartItem!: ElementRef<HTMLDivElement>;

  public cart!: ShoppingCart;
  public productsGroup: Product[] = [];
  constructor(private _productService: ProductService,
              private _cartService: CartService,
              private fb: FormBuilder,
              private _router: Router,
              private changeDetector: ChangeDetectorRef,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this.fetchProductsGroupByIds();
  }

  openModal(titleContent: string, bodyContent: string){
    this.childModalContent = {'title': titleContent, 'body': bodyContent, buttonBackgroundColor: 'btn', fromComponent: 'Cart'}
    this.isModalOpen = true;
    this.changeDetector.detectChanges();
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

  public removeLineItemFromList(itemIdOnLocalStorage?: number, itemName?: string){
    this.item.itemId = Number(itemIdOnLocalStorage);
    this.item.itemName = String(itemName);

    if(!this.isClickedDeleteButton){
      this.openModal(`Deletar ${itemName}?`, `Esta ação é permanente e não pode ser desfeita.`);
    }
    else{
      let updatedCart: ShoppingCartItem[];
      updatedCart = this.cart.items
        .filter((item: ShoppingCartItem) => item.itemId != this.item.itemId);

      this.cart.items = updatedCart;

      this._cartService.editCartFromLocalStorage(this.cart);

      this.fetchProductsGroupByIds();
    }

  }

  public onClickDeleteButton(isClickedDeleteButton: boolean){
    this.isClickedDeleteButton = isClickedDeleteButton;
    this.removeLineItemFromList(this.item.itemId, this.item.itemName);
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

  public continueToOrderReview() {
    this._router.navigate(['/products/checkout/order-summary']);
  }


  protected readonly moneyMask = moneyMask;
}
