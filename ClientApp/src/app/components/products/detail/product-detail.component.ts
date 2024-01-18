import {AfterContentInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {catchError, map, tap, timer} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ProductService} from "@components/products/product.service";
import {moneyMask} from "@components/products/helpers/format-currency-helper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  Actions,
  Cart,
  ErrorName,
  Modal,
  QuantityOfItems
} from "@interfaces/products/detail/product-detail";
import {Product} from "@interfaces/products/product";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, AfterContentInit {

  public product!: Product;
  public parentModalContent!: Modal;
  public isModalOpen: boolean = false;
  public submitted: boolean = false;
  public cart: Cart = {
    quantityOfItems: 1,
    itemInfo: {name: '', price: 0, id: 0}
  };
  public actions: Actions = {add: 'add', rem: 'rem'};
  public errorName: ErrorName = {min: 'min', max: 'max'};
  public quantityOfItems: QuantityOfItems = {min: 1, max: 20};
  constructor(
    private fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private changeDetector: ChangeDetectorRef) {}


    addQuantityToCartForm: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this._activatedRoute.url
      .subscribe( (urlSegments: UrlSegment[]): any => {
        const productId = Number(urlSegments[2].path);
        this.cart.itemInfo.id = productId;
        this.fetchProductById(productId)
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
        tap( (product: HttpResponse<Product>): any => {
          this.product = product.body as Product;
        }),
        catchError( (e: HttpErrorResponse): any => {
          this.openModal(e);
        })
      ).subscribe()

  }

  public checkMinAndMaxQuantityOfItems(action: string, errorName: string): boolean{

    if(action == this.actions.add && this.cart.quantityOfItems < this.quantityOfItems.max)
      return true;


    if(action == this.actions.rem && this.cart.quantityOfItems > this.quantityOfItems.min)
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


  public addToCart(): void{

    const canAdd: boolean = this.checkMinAndMaxQuantityOfItems(this.actions.add,this.errorName.max);

    if(canAdd){
      this.cart.quantityOfItems++

      this.addQuantityToCartForm
        .get("addToCartOptions")
        ?.setValue(this.cart.quantityOfItems);
    }

  }

  public removeFromCart(): void{

    const canRem: boolean = this.checkMinAndMaxQuantityOfItems(this.actions.rem,this.errorName.min);

    if(canRem){
      this.cart.quantityOfItems--;

      this.addQuantityToCartForm
        .get("addToCartOptions")
        ?.setValue(this.cart.quantityOfItems);
    }
  }


  public submit() {

    this.submitted = true;

    if (this.addQuantityToCartForm.invalid)
      return;



  }



  protected readonly moneyMask = moneyMask;
}
