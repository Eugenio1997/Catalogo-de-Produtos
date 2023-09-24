import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ProductService} from "../service/product.service";
@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html'
})
export class RegisterProductComponent {

  private _router: Router;
  private _baseUrl: string;
  private _http: HttpClient;
  private _productService: ProductService;
  myForm: FormGroup = this.fb.group({});
  constructor(private fb: FormBuilder,
              http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              router: Router,
              private renderer: Renderer2,
              private productService: ProductService)
  {
      this._http = http;
      this._baseUrl = baseUrl;
      this._router = router;
      this._productService = productService;
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(25)]],
      type: ['-- Selecione o tipo de produto --', [Validators.required]],
    });
  }

  public productTypes: Array<{ name: string; value: number }> = [
    { name: "Organic", value: 0},
    { name: "Non-Organic", value: 1}
  ];

  public submit():void {

    if (this.myForm.invalid) {
      alert("Preencha todos os campos!");
      return;
    }

    this._productService
      .registerProduct(this.myForm.value);

  }

}
