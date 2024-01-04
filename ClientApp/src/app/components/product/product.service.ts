import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {FormGroup} from "@angular/forms";
import {Product} from "@interfaces/product";

@Injectable()
export class ProductService {

  //properties
  public totalPages: number = 1;
  public pageIndex = 1;
  public products: Product[] = [];
  constructor(
    private _http: HttpClient,
    @Inject('BACKEND_BASE_URL') private _baseUrl: string) {
  }


  public fetchProducts(pageIndex:number): Observable<HttpResponse<Product[]>> {
    return this._http
      .get<Product[]>(this._baseUrl + 'product?pageIndex=' + pageIndex,
        { observe: 'response' })
  }

  public fetchProductsByName(productName:string): Observable<HttpResponse<Product[]>> {
    return this._http
      .get<Product[]>(this._baseUrl + 'product/byName?productName=' + productName ,
        { observe: 'response' })
  }

  public fetchProductsByOrderingValue(query: string ): Observable<HttpResponse<Product[]>> {
    return this._http
      .get<Product[]>(this._baseUrl + `product/orderBy?${query}`,
        { observe: 'response' })
  }

  public postProduct(formData: FormGroup){
    return this._http.post<Product>(this._baseUrl + 'product',
      formData, {observe: 'response'})
  }
}
