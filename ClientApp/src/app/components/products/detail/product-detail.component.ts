import {AfterContentInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from "@angular/router";
import {catchError, map, timer} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {moneyMask} from "@components/products/helpers/format-currency-helper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  Actions,
  ErrorName,
  Modal,
  QuantityOfItems
} from "@interfaces/products/detail/product-detail";
import {Product} from "@interfaces/products/product";
import {ShoppingCart} from "@interfaces/products/cart/cart";
import {ProductService} from "@components/products/services/product.service";
import {CartService} from "@components/products/services/cart.service";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  public currentItemIndex = 0;
  public productId: number = 0;
  public product!: Product;
  public parentModalContent!: Modal;
  public isModalOpen: boolean = false;
  public submitted: boolean = false;
  public cart: ShoppingCart = {
    items: [
      {itemQuantity: 1, itemId: 1}
    ]
  };
  public actions: Actions = {add: 'add', rem: 'rem'};
  public errorName: ErrorName = {min: 'min', max: 'max'};
  public quantityOfItems: QuantityOfItems = {min: 1, max: 20};
  public isCartOnHeader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private changeDetector: ChangeDetectorRef,
    private _router: Router,
    private _cartService: CartService) {}


    addQuantityToCartForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.isCartOnHeader = true;

    this._cartService
      .emitDisplayCartOnHeader(this.isCartOnHeader);

    this._activatedRoute.url
      .subscribe( (urlSegments: UrlSegment[]): any => {
        this.productId = Number(urlSegments[2].path);
        this.fetchProductById(this.productId)
      });
  }

  ngOnChanges() {
    // Compare o id da rota atual com o id anterior
    this._activatedRoute.url
      .subscribe( (urlSegments: UrlSegment[]): any => {

        const newProductId = Number(urlSegments[2].path);
        if(this.productId != newProductId){
          this.currentItemIndex++;
        }
      });
  }

  ngAfterContentInit(): void {
    this.addQuantityToCartForm = this.fb.group({
      addToCartOptions: [1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(20)
        ]
      ],
    });
  }

  openModal(e: HttpErrorResponse){

    this.parentModalContent = {title: 'Erro', body: e.error, buttonBackgroundColor: 'btn-danger btn', fromComponent: 'Product-Detail'}
    this.isModalOpen = true;
    this.changeDetector.detectChanges();
  }

  private fetchProductById(productId: number){
    this._productService
      .fetchProductById(productId)
      .pipe(
        map( (product: HttpResponse<Product>): any => {
          this.product = product.body as Product;
          this.cart.items[0].itemId = this.product?.id as number;
        }),
        catchError( (e: HttpErrorResponse): any => {
          this.openModal(e);
        })
      ).subscribe()

  }

  public checkMinAndMaxQuantityOfItems(action: string, errorName: string, itemIndex: number): boolean{

    if(action == this.actions.add && this.cart.items[itemIndex].itemQuantity < this.quantityOfItems.max)
      return true;


    if(action == this.actions.rem && this.cart.items[itemIndex].itemQuantity > this.quantityOfItems.min)
      return true;


    this.addQuantityToCartForm
      .get("addToCartOptions")
      ?.setErrors({
        [errorName] : true
      });


    timer(2000)
      .pipe(
        map( () => {

          this.addQuantityToCartForm
            .get("addToCartOptions")
            ?.setErrors(null);
        })
      ).subscribe();

    return false;
  }


  public addItemToList(): void{

    const canAdd: boolean = this.checkMinAndMaxQuantityOfItems(this.actions.add,this.errorName.max,this.currentItemIndex);

    if(canAdd){
      this.cart.items[this.currentItemIndex].itemQuantity++;

      this.addQuantityToCartForm
        .get("addToCartOptions")
        ?.setValue(this.cart.items[this.currentItemIndex].itemQuantity);

      this._cartService.addCartToLocalStorage(this.cart);

    }
  }

  public removeItemFromList(): void{

    const canRem: boolean = this.checkMinAndMaxQuantityOfItems(this.actions.rem,this.errorName.min,this.currentItemIndex);

    if(canRem){
      this.cart.items[this.currentItemIndex].itemQuantity--;


      this.addQuantityToCartForm
        .get("addToCartOptions")
        ?.setValue(this.cart.items[this.currentItemIndex].itemQuantity);


      this._cartService.addCartToLocalStorage(this.cart);


    }
  }


  public AddListItemsToCart() {

    this.submitted = true;

    if (this.addQuantityToCartForm.invalid)
      return;

    const itemsTotalOnCart = this._cartService
      .retrieveTotalQuantityOfItemsOnCart();

    this._cartService
      .emitTotalQuantityOfItems(itemsTotalOnCart)


  }


  ngOnDestroy(): void {
    this.isCartOnHeader = false;

    this._cartService
      .emitDisplayCartOnHeader(this.isCartOnHeader);
  }


  protected readonly moneyMask = moneyMask;
}
