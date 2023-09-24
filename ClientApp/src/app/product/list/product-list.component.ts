import { Component, Inject } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Product} from "../../interfaces";
import {ProductService} from "../service/product.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  public products: Product[] = new Array<Product>()
  public pageIndex: number = 1;
  public totalPages: number = 1;
  private _baseUrl: string;
  private _http: HttpClient;
  private _productService: ProductService;

  constructor(http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              private productService: ProductService) {
    this._http = http;
    this._baseUrl = baseUrl;
    this._productService = productService;
  }

  ngOnInit(): void {
    this.fetchProducts(this.pageIndex);
  }

  public pagePrev(): void{
    if(this.pageIndex > 1){
      this.pageIndex = this.pageIndex - 1;
      this.fetchProducts(this.pageIndex);
    }
  }

  public pageNext(): void{
    if(this.pageIndex < this.totalPages){
      this.pageIndex = this.pageIndex + 1;
      this.fetchProducts(this.pageIndex);
    }
  }

  public fetchProducts(pageIndex:number): void {
    this.productService.fetchProducts(pageIndex)
      .subscribe((data:HttpResponse<Array<Product>>): void => {
        this.totalPages = Number(data.headers.get('totalPages'));
        this.products = data.body as Product[];
      });
  }

  public deleteProduct(id: number): void{
    this.productService.deleteProduct(id)
      .subscribe((data:HttpResponse<Array<Product>>): void => {
        this.totalPages = Number(data.headers.get('totalPages'));
        this.products = data.body as Product[];
      });
  }
}
