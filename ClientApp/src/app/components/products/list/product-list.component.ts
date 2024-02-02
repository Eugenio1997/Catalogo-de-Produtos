import {
  Component,
  OnDestroy, OnInit,
} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import ordenation from "@assets/json/ordering-types.json";
import {Product} from "@interfaces/products/product";
import {ProductService} from "@components/products/services/product.service";
import {CartService} from "@components/products/services/cart.service";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['product-list.component.css']
})
export class ProductListComponent implements OnDestroy, OnInit {

  //properties
  public searchInputPlaceholder: string = "Digite o nome do produto";
  public isCartOnHeader: boolean = false;
  public emptyProductsMessage!: string;
  public sidenavStatus!: boolean;
  public screenWidth: number = 0;
  public deviceType!: Array<{ deviceType: string; isEnable: boolean }>;
  public products: Product[] = [];
  public pageIndex = 1;
  public totalPages: number = 1;
  public totalCount!: number;
  public searchInput: string = '';
  public hasProducts!: boolean;
  private notifier = new Subject()
  public orderingValue: string = '';
  public selectFilterOption!: {label: string, value: string};
  public readonly orderingTypes: any = ordenation.types;
  constructor(
    private _productService: ProductService,
    private _cartService: CartService
  ) {}


  ngOnInit() {

    this.isCartOnHeader = true;

    this._cartService
      .emitDisplayCartOnHeader(this.isCartOnHeader);

    this.orderingValue = this.orderingTypes[1].value;
    this.fetchProductsByOrderingValue(this.orderingValue, this.pageIndex.toString());
  }

  public hasOrderingValue(orderingValue: string): void{
    this.orderingValue ?
      this.fetchProductsByOrderingValue(orderingValue,this.pageIndex.toString()) :
      this.fetchProducts(this.pageIndex)
  }

  public pagePrev(){
    if(this.pageIndex > 1){
      this.pageIndex = this.pageIndex - 1;
    }
    this.hasOrderingValue(this.orderingValue);
  }

  public pageNext(){
    if(this.pageIndex < this.totalPages){
      this.pageIndex = this.pageIndex + 1;
    }
    this.hasOrderingValue(this.orderingValue);
  }

  public isProductsListEmpty(products: Array<Product>): boolean {
     return !products.length ?
        this.hasProducts = false :
        this.hasProducts = true;
  }


  fetchProducts(pageIndex:number) {
    const products = this._productService
      .fetchProducts(pageIndex)
      .pipe(takeUntil(this.notifier))
      .subscribe((data) => {
        this.totalPages = Number(data.headers.get('totalPages'));
        this.totalCount = Number(data.headers.get('totalCount'));
        this.products = data.body as Product[];
        this.isProductsListEmpty(this.products);
        this.emptyProductsMessage = "Não há produtos cadastrados.";
      });
  }

  fetchProductsByName(productName:string) {
    if(!productName.length)
      return;

    this._productService
      .fetchProductsByName(productName)
      .pipe(takeUntil(this.notifier))
      .subscribe((data) => {
        this.totalPages = Number(data.headers.get('totalPages'));
        this.totalCount = Number(data.headers.get('totalCount'));
        this.products = data.body as Product[];
        this.isProductsListEmpty(this.products);
        this.emptyProductsMessage = "Produto não cadastrado.";
      });
  }

  makeQuery(orderingValue: string, pageIndex: string){
    let query: string;
    query = `orderingValue=${orderingValue}&pageIndex=${pageIndex}`;
    return query;
  }

  fetchProductsByOrderingValue(orderingValue: string, pageIndex: string){
    this._productService
      .fetchProductsByOrderingValue(this.makeQuery(orderingValue, pageIndex))
      .pipe(takeUntil(this.notifier))
      .subscribe((data) => {
        this.totalPages = Number(data.headers.get('totalPages'));
        this.totalCount = Number(data.headers.get('totalCount'));
        this.products = data.body as Product[];
        this.isProductsListEmpty(this.products);
        this.emptyProductsMessage = "Nenhum produto foi encontrado.";
      });
  }

  ngOnDestroy(): void {

    this.isCartOnHeader = false;

    this._cartService
      .emitDisplayCartOnHeader(this.isCartOnHeader);

    this.notifier.next(1);
    this.notifier.complete();
  }

}
