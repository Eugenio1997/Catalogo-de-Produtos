import {HttpClient, HttpResponse} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {Inject, Injectable} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Product} from "../../interfaces";

@Injectable()
export class ProductService {

  private _http: HttpClient;
  private readonly _baseUrl: string;
  private _router: Router;

  constructor(private fb: FormBuilder,
              http: HttpClient,
              @Inject('BASE_URL') baseUrl: string,
              router: Router)
  {
    this._http = http;
    this._baseUrl = baseUrl;
    this._router = router;
  }

  public registerProduct(myForm: FormGroup) {

    this._http.post(this._baseUrl + 'product',
      myForm.value, {observe: 'response'})
      .pipe(
        tap(response =>
          this._router.navigate(['/product-list'])),
        catchError((error): any  => {
          alert(error.error);
        })
      )
      .subscribe();
  }

  fetchProducts(pageIndex:number) {
    return this._http
      .get<Product[]>(
        this._baseUrl + 'product?pageIndex=' + pageIndex,
        { observe: 'response' })

  }

  deleteProduct(id: number): Observable<HttpResponse<Product[]>> {
    debugger;
    return this._http.delete<Product[]>(
      this._baseUrl + 'product/' + id,
        { observe: 'response' })
  }
}
