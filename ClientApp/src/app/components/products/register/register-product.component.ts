import {
  ChangeDetectorRef,
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {catchError, Subject, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {moneyMask} from "@components/products/helpers/format-currency-helper";
import {Modal} from "@interfaces/products/detail/product-detail";
import {Category} from "@interfaces/products/registration/register-product";
import {CustomValidators} from "@components/products/helpers/custom-validators";
import {ProductService} from "@components/products/services/product.service";


@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['register-product-component.css']
})
export class RegisterProductComponent implements OnInit, OnDestroy{

  //properties
  public categories: Category[] = [];
  public parentModalContent!: Modal
  public isModalOpen: boolean = false;
  public screenWidth: number = 0;
  private notifier = new Subject()
  public priceInputPlaceholder: string = "R$ 0,00";
  protected readonly moneyMask = moneyMask;

  productRegistrationForm: FormGroup = this.fb.group({});
  constructor(private fb: FormBuilder,
              private _router: Router,
              private _productService: ProductService,
              private _changeDetector: ChangeDetectorRef,
              private _httpClient: HttpClient) {}


  //hooks
  ngOnInit() {
    const categoriesUrl = '../../../../assets/json/product-categories.json';

    this._httpClient
        .get(categoriesUrl)
        .subscribe( (data: any) => {
          this.categories = data.categories;
        })

    this.productRegistrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1), CustomValidators.validateMaxQuantityInput]],
      description: ['', [Validators.required, Validators.minLength(25)]],
      type: ['-- Selecione a categoria do produto --', [Validators.required, CustomValidators.validateCategoryName]],
      imageRef: ['', ],
    });
  }

  public limitToThreeCharacters(quantityInputValue: string){
    const valueAsString = String(quantityInputValue);
    const firstThreeNumbers = valueAsString.substring(0,3);
    this.productRegistrationForm
        .get('quantity')?.setValue(firstThreeNumbers);
  }

  //methods
  public formatPriceAsNumber(price: string): number {
    const priceWithoutNonNumericCharacters = price.replace(/\D/g, '');
    return parseFloat(priceWithoutNonNumericCharacters)/100;
  }
  public submit() {
    const price = this.productRegistrationForm.controls.price.value;
    const priceAsNumber = this.formatPriceAsNumber(price);
    this.productRegistrationForm.controls.price.setValue(priceAsNumber);

    this._productService
        .postProduct(this.productRegistrationForm.value)
        .pipe(
          tap(response =>
            this._router.navigate(['/product-list'])),
          takeUntil(this.notifier),
          catchError((httpErrorResponse: HttpErrorResponse): any  => {
            this.openModal(httpErrorResponse);
          })
        ).subscribe()
  }

  openModal(httpErrorResponse: HttpErrorResponse){
    this.parentModalContent = {'title': 'Erro', 'body': httpErrorResponse.error, buttonBackgroundColor: 'btn-danger btn'}
    this.isModalOpen = true;
    this._changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.notifier.next(1);
    this.notifier.complete();
  }

}
